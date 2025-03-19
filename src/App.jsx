import './App.scss';

import { useState } from 'react';

import {
  deck,
  bonusDeck,
  calculateBestHand,
  payTable,
  handValue,
  evaluateHand,
  boardToString,
} from './poker';

import Board from './assets/components/Board';
import BonusHand from './assets/components/BonusHand';
import FlashMessage from './assets/components/FlashMessage';
import Modal from './assets/components/Modal';

const App = () => {

  const aboutModal = [
    <img src='royal_flush.svg' style={ { float: 'right' } } />,
    <h1 style={ { color: 'white', textAlign: 'center' } }>Pokeromino</h1>,
    <h2 style={ { color: 'white', textAlign: 'center' } }>Poker Hands, Boggle Rules!</h2>,
    <p style={ { fontFamily: 'sans-serif', fontWeight: 800, color: 'white', textAlign: 'center' } }>
      Find the best poker hand on the board and score! Hands must be five cards long and form a continuous path.
    </p>,
    <img src='game_guide.svg' />,
  ];

  const [ modal, setModal ] = useState( [ ...aboutModal ] );

  const [ message, setMessage ] = useState();

  const [ bonus, setBonus ] = useState( {
    deck: bonusDeck( true ),
    hand: [],
  } );

  const [ game, setGame ] = useState( {
    score: 0,
    board: [ Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ) ],
    guess: [],
    bestHand: [],
  } );

  // const [ rounds, setRounds ] = useState( {} );

  const flashMessage = message => {
    setMessage( message );
    setTimeout( () => setMessage(), 3000 );
  };

  const drawBoard = async () => {

    setGame( {
      ...game,
      board: [ Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ), Array( 4 ).fill( 0 ) ],
      guess: [],
      bestHand: [],
    } );

    if ( bonus.hand.length === 5 ) setBonus( {
      deck: bonusDeck( true ),
      hand: [],
    } );

    await new Promise( resolve => setTimeout( resolve, 250 ) ).then( () => {
      const newDeck = deck( true );
      const board = [ newDeck.splice( -4 ), newDeck.splice( -4 ), newDeck.splice( -4 ), newDeck.splice( -4 ) ];
      console.log( boardToString( board ) );
      setGame( {
        ...game,
        board,
        guess: [],
        bestHand: [],
      } );
    } );

  };

  const evaluateGuess = () => {

    const evaluateGuess = evaluateHand( game.board, game.guess );
    if ( evaluateGuess < 0 ) {
      flashMessage( 'Invalid hand' );
      return;
    }

    let score = game.score,
      bestHand = calculateBestHand( game.board, 5 ),
      points = payTable[ handValue( game.guess ) ] * 50,
      sum = ( a, b ) => a + b,
      awesome = game.guess.reduce( sum, 0 ) === bestHand.reduce( sum, 0 );

    if ( awesome ) points *= 2;
    score += points;
    const drawBonusHand = [ ...bonus.hand, bonus.deck.pop() ];
    if ( drawBonusHand.length === 5 ) score *= payTable[ handValue( drawBonusHand ) ];
    flashMessage( `${ awesome ? 'Awesome! ' : 'Nice: ' } +${ points } points` );

    setGame( {
      ...game,
      score,
      bestHand,
    } );
    setBonus( { ...bonus, hand: drawBonusHand } );

  };

  return <main className="App">

    <Modal
      display={ !!modal }
      closeModal={ () => setModal( null ) }
      backgroundImage='green_felt.jpg'
      width={ '50vw' }
      height={ '60vh' }
    >
      { modal }
    </Modal>

    <FlashMessage message={ message } />

    <BonusHand bonus={ bonus } />

    <Board game={ game } setGame={ setGame }/>

    <section style={ scorecardStyle }>
      <aside style={ { color: "white" } }>Score: { game.score }</aside>
      <span>
        <button onClick={ drawBoard } disabled={ !game.bestHand.length & !!game.board[ 0 ][ 0 ] }>Draw board</button>
        <button onClick={ evaluateGuess } disabled={ game.guess.length < 5 || !!game.bestHand.length }>Guess</button>
        <button onClick={ () => setGame( { ...game, guess: [] } ) } disabled={ !game.guess.length || !!game.bestHand.length }>Clear</button>
      </span>
    </section>

  </main>;

}

export default App;

const scorecardStyle = {
  display: "flex",
  gap: 5,
  fontSize: "18pt",
  justifyContent: "space-around",
};
