import { flushes, fiveUniqueCards, hashAdjust, hashValues } from "./lookupTables";

export const suits = { 8: "Clubs", 4: "Diamonds", 2: "Hearts", 1: "Spades" };
export const rankPrimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41 ];

export function rank(card) { return ( card >>> 8 ) % 16; }
export function suit(card) { return ( card >>> 12 ) % 16; }

export const rankNames = [ "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" ];
export const suitNames = [ null, "Spades", "Hearts", null, "Diamonds", null, null, null, "Clubs" ];
export function cardName(card) { return `${ rankNames[ rank( card ) ] } of ${ suitNames[ suit( card ) ] }`; }

export function deck( shuffled, bonusDeck ) {
    const result = [];
    for ( let rank = bonusDeck ? 7 : 0; rank < 13; rank++ ) for ( let suit of [ 8, 4, 2, 1 ] )
        result.push( ( rankPrimes[ rank ] ) | ( rank << 8 ) | ( suit << 12 ) | ( ( 1 << rank ) << 16 ) );
    if ( !shuffled ) return result;
    for ( let i = bonusDeck? 23 : 51; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ result[ i ], result[ j ] ] = [ result[ j ], result[ i ] ];
    }
    return result;
}

export function flush( hand ) { return hand.reduce( ( total, card ) => total & card, 0xF000 ); }

export function flushBitPattern( flush ) { return flush.reduce( ( total, card ) => total | card , 0 ) >>> 16; }
export function flushRank( flush ) { return flushes[ flushBitPattern( flush ) ]; }
export function fiveUniqueCardsRank( hand ) { return fiveUniqueCards[ flushBitPattern( hand ) ]; }
export function primeMultiplicand( hand ) { return hand.reduce( ( total, card ) => total * ( card & 0xFF ), 1 ); }

export function findFast( u ) {
    u += 0xe91aaa35;
    u ^= u >>> 16;
    u += u << 8;
    u ^= u >>> 4;
    let a  = ( u + ( u << 2 ) ) >>> 19;
    return a ^ hashAdjust[ ( u >>> 8 ) & 0x1ff ];
}

export function handRank( hand ) {
    if ( flush( hand ) ) return flushRank( hand );
    let uniqueCardsRank = fiveUniqueCardsRank( hand );
    if ( uniqueCardsRank ) return uniqueCardsRank;
    return hashValues[ findFast( primeMultiplicand( hand ) ) ];
}

export function handValue( hand ) {
    const rank = handRank( hand );
    if ( rank > 6185 ) return "High card";
    else if ( rank > 3325 ) return "One pair";
    else if ( rank > 2467 ) return "Two pair";
    else if ( rank > 1609 ) return "Three of a kind";
    else if ( rank > 1599 ) return "Straight";
    else if ( rank > 322 )  return "Flush";
    else if ( rank > 166 )  return "Full house";
    else if ( rank > 10 )   return "Four of a kind";
    else return "Straight flush";
}

export const payTable = {
    "High card": 0,
    "One pair": 1,
    "Two pair": 2,
    "Three of a kind": 3,
    "Straight": 4,
    "Flush": 6,
    "Full house": 9,
    "Four of a kind": 25,
    "Straight flush": 50,
    "Royal flush": 250,
};

export function possibleHands( deck, combinationLength ) {
    let head, tail, result = [];
    if ( combinationLength > deck.length || combinationLength < 1 ) { return []; }
    if ( combinationLength === deck.length ) { return [ deck ]; }
    if ( combinationLength === 1 ) { return deck.map( element => [ element ] ); }
    for ( let i = 0; i < deck.length - combinationLength + 1; i++ ) {
      head = deck.slice( i, i + 1 );
      tail = possibleHands( deck.slice( i + 1 ), combinationLength - 1 );
      for ( let j = 0; j < tail.length; j++ ) { result.push( head.concat( tail[ j ] ) ); }
    }
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

const sortDescending = ( x, y ) => y - x;

const adjacentSquares = ( coordinates, board ) => {
    const horizontal = [ coordinates[ 0 ] - 1, coordinates[ 0 ], coordinates[ 0 ] + 1 ];
    const vertical = [ coordinates[ 1 ] - 1, coordinates[ 1 ], coordinates[ 1 ] + 1 ];
    const cartesianProduct = ( ...horizontal ) => horizontal.reduce( ( horizontal, vertical ) => horizontal.flatMap( product1 => vertical.map( product2 => [ product1, product2 ].flat() ) ) );
    return cartesianProduct( horizontal, vertical ).filter( square =>
        square[ 0 ] > -1 && square[ 1 ] > -1 && square[ 0 ] < board.length && square[ 1 ] < board[ 0 ].length && !( square[ 0 ] === coordinates[ 0 ] && square[ 1 ] === coordinates[ 1 ] )
    );
};

const getPossibleHands = ( board, handLength, currentCoordinates, handSoFar, handList ) => {
    if ( handSoFar.length === handLength ) {
        let sortedHand = handSoFar.sort( sortDescending ).toString();
        if ( handList.indexOf( sortedHand ) < 0 ) { handList.push( sortedHand ); }
    } else {
        let nextSquares = adjacentSquares( currentCoordinates, board );
        for ( let nextSquare in nextSquares ) {
            let thisSquare = board[ currentCoordinates[ 0 ] ][ currentCoordinates[ 1 ] ];
            if ( handSoFar.indexOf( thisSquare ) < 0 ) { getPossibleHands( board, handLength, nextSquares[ nextSquare ], [ ...handSoFar, thisSquare ], handList ); }
        }
    }
};

const allPossibleHands = ( board, handLength ) => {
    let handList = [];
    for ( let row = 0; row < board.length; row++ ) for ( let column = 0; column < board[ 0 ].length; column++ )
        getPossibleHands( board, handLength, [ row, column ], [], handList );
    return Object.fromEntries( handList.map( hand => [ hand, handRank( hand.split( "," ).map( card => parseInt( card ) ) ) ] ) );
};

export function calculateBestHand( board, handLength ) {
    const possibleHands = allPossibleHands( board, handLength );
    return Object.keys( possibleHands ).reduce( ( thisHand, thatHand ) =>
        possibleHands[ thisHand ] > possibleHands[ thatHand ] ? thatHand : thisHand
    ).split( "," ).map( card => parseInt( card ) );
}

export function evaluateHand( board, hand ) {
    const possibleHands = allPossibleHands( board, 5 );
    if ( Object.keys( possibleHands ).indexOf( hand.sort( sortDescending ).join() ) < 0 ) return -1;
    for ( let possibleHand of Object.keys( possibleHands ) ) {
        if ( possibleHands[ possibleHand ] < handRank( hand ) ) return 0;
    }
    return 1;
}
