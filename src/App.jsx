import './App.scss';

import { useState } from 'react';

import {
  deck,
  calculateBestHand,
  payTable,
  handValue,
  evaluateHand,
} from './poker';

import Board from './assets/components/Board';
import BonusHand from './assets/components/BonusHand';
import FlashMessage from './assets/components/FlashMessage';
import Modal from './assets/components/Modal';

const App = () => {

  const [ modal, setModal ] = useState( [
    <h1>POKEROMINO</h1>,
    <h2>Poker Hands - Boggle Rules!</h2>,
  ] );

  const [ message, setMessage ] = useState();

  const [ bonus, setBonus ] = useState( {
    deck: deck( true, true ),
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
      deck: deck( true, true ),
      hand: [],
    } );

    await new Promise( resolve => setTimeout( resolve, 250 ) ).then( () => {
      const newDeck = deck( true );
      setGame( {
        ...game,
        board: [ newDeck.splice( -4 ), newDeck.splice( -4 ), newDeck.splice( -4 ), newDeck.splice( -4 ) ],
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
      width={ 500 }
      height={ 400 }
    >
      { modal }
    </Modal>

    <FlashMessage message={ message } />

    <BonusHand bonus={ bonus } />

    <Board game={ game } setGame={ setGame }/>

    <section style={ scorecardStyle }>
      <span>Score: { game.score }</span>
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
