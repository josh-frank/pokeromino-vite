import styled from "styled-components";

const FlashMessage = ( { message } ) => message && <StyledFlashMessage>{ message }</StyledFlashMessage>;

export default FlashMessage;

const StyledFlashMessage = styled.aside`
  position: absolute;
  z-index: 1;
  padding: 0.5rem;
  background-color: #050;
  box-shadow: 0.5rem 0.5rem 1rem black;
  color: white;
  font-weight: bold;
`;