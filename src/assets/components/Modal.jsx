import React from 'react';
import styled from 'styled-components';

const Modal = ( {
  display,
  closeModal,
  backgroundImage,
  backgroundColor,
  width,
  height,
  children
} ) => {

	return (
		<>
			<StyledModalDimmer open={ display }/>
			<StyledModalWindow 
        open={ display } 
        backgroundImage={ backgroundImage } 
        backgroundColor={ backgroundColor } 
        width={ width } 
        height={ height }
      >
				{ !!display && <>
					<InvisibleButton
						style={ {
							position: 'absolute',
							top: 0,
							right: 10,
							fontSize: '32pt',
							filter: backgroundImage ? 'drop-shadow( 4px 4px 8px rgb( 0 0 0 / 1 ) )' : 'none',
							color: backgroundImage ? 'white' : 'black'
						} }
						onClick={ closeModal }
					>&times;</InvisibleButton>
					{ children }
				</> }
			</StyledModalWindow>
		</>
	);

};

export default Modal;

export const InvisibleButton = styled.button`
  border: none;
  background-color: transparent;
`;

export const StyledModalDimmer = styled.div`
  z-index: 10;
  pointer-events: ${ ( { open } ) => open ? 'auto' : 'none' };
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${ ( { open } ) => open ? 'rgba( 0, 0, 0, 0.5 )' : 'none' };
  transition: background-color 250ms ease;
`;

export const StyledModalWindow = styled.div`
  position: fixed;
  z-index: 99;
  left: calc( ${ ( { width } ) => ( 100 - parseInt( width ) ) / 2 || 25 }% );
  top: calc( ${ ( { height } ) => ( 100 - parseInt( height ) ) / 2 || 25 }% );
  overflow: none;
  width: ${ ( { width } ) => width || '50%' };
  height: ${ ( { height } ) => height || '50%' };
  padding: 2vw;
  background-color: ${ ( { backgroundColor = 'white' } ) => backgroundColor };
  ${ ( { backgroundImage } ) => backgroundImage ? `
	background-image: linear-gradient( rgba( 109, 207, 246, 0 ), rgba( 0, 91, 151, 0.5 ) ), url('${ backgroundImage }');
	background-size: cover;
    background-position: top;
  ` : '' }
  box-shadow: 5px 10px 20px black;
  transform: scale( ${ ( { open } ) => open ? '1, 1' : '0, 0' } );
  transition: transform 250ms ease;
  & h2 {
    cursor: pointer;
    color: black;
  }
  & p { color: black; }
  @media only screen and ( max-width: 728px ) {
    width: 80%;
    left: calc( 10% );
  }
`;

