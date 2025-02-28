import cardVectors from "./cardVectors";
import { cardName } from '../../poker';
import styled, { keyframes } from "styled-components";

const AnimatedCard = ( { card, selected, correct, toggleGuess, small = false } ) => {

    return <StyledAnimatedCard 
        card={ card } 
        selected={ selected } 
        correct={ correct } 
        onClick={ toggleGuess }
        small={ small }
    >
        <button>
            <img
                src={ cardVectors[ 0 ] }
                alt='Pokeromino'
            />
            <img
                src={ cardVectors[ card ] }
                alt={ cardName( card ) }
            />
        </button>
    </StyledAnimatedCard>;

};

export default AnimatedCard;

const cardWiggle = () => keyframes`
    0% { left: 0; }
    33% { left: -0.25rem; }
    66% { left: 0.25rem; }
    100% { left: 0; }
`;

const StyledAnimatedCard = styled.div`
    background-color: transparent;
    width: ${ ( { small } ) => small ? 50 : 100 }px;
    height: ${ ( { small } ) => small ? 50 : 100 }px;
    padding: 0.5rem;
    perspective: 1000px;
    button {
        background-color: white;
        outline: ${ ( { selected, correct } ) => correct ? '0.25rem lightgreen solid' : selected ? '0.25rem orange solid' : 'none' };
        border: none;
        border-radius: 5px;
        border-spacing: 5px;
        position: relative;
        width: 100%;
        height: 100%;
        transition: all 250ms;
        transform: rotateY( ${ ( { card } ) => !!card ? 1 : 0 }turn );
        transform-style: preserve-3d;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    }
    img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
    button:focus {
        animation: ${ cardWiggle() } 100ms linear;
    }
    img:nth-child( 2 ) {
        transform: rotateY( ${ ( { card } ) => !!card ? 0 : 1 }turn );
    }
`;
