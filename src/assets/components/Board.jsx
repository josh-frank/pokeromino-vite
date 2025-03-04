import styled from 'styled-components';
import AnimatedCard from './AnimatedCard';

const Board = ( { game, setGame } ) => {

    const toggleGuess = card => setGame( {
        ...game,
        guess: game.guess.includes( card ) ? game.guess.filter( otherCard => otherCard !== card ) : [ ...game.guess, card ]
    } );

    return game.board.map( ( row, rowIndex ) => <StyledBoard key={ rowIndex }>
        { row.map( ( card, columnIndex ) => <AnimatedCard
            key={ columnIndex }
            card={ card }
            selected={ game.guess.includes( card ) }
            correct={ game.bestHand.includes( card ) }
            toggleGuess={ () => toggleGuess( card ) }
        /> ) }
    </StyledBoard> );

};

export default Board;

const StyledBoard = styled.div`
    width: 30rem;
    display: flex;
    margin: 0 auto;
`;
