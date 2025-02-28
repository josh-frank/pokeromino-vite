import styled from 'styled-components';
import AnimatedCard from './AnimatedCard';

const Board = ( { state, setState } ) => {

    const toggleGuess = card => setState( {
        ...state,
        guess: state.guess.includes( card ) ? state.guess.filter( otherCard => otherCard !== card ) : [ ...state.guess, card ]
    } );

    return state.board.map( ( row, rowIndex ) => <StyledBoard key={ rowIndex }>
        { row.map( ( card, columnIndex ) => <AnimatedCard
            key={ columnIndex }
            card={ card }
            selected={ state.guess.includes( card ) }
            correct={ state.bestHand.includes( card ) }
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
