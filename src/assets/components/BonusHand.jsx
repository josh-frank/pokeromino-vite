import styled from "styled-components";
import AnimatedCard from "./AnimatedCard";

const BonusHand = ( { bonus } ) => {

  return <StyledBonusHand>
    { bonus.hand.concat( Array( 5 ).fill( 0 ) ).slice( 0, 5 ).map( ( card, index ) => <AnimatedCard
      key={ index }
      card={ card }
      small
    /> ) }
  </StyledBonusHand>;

};

export default BonusHand;

const StyledBonusHand = styled.div`
  width: 20rem;
  display: flex;
  margin: 0 auto;
  display: flex;
`;