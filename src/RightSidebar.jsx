import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StyledInput } from './WheelStyles.jsx';

const StyledSidebar = styled.div`
  z-index: 10;
  position: absolute;
  right: 0;
  width: 80vw;
  max-width: 500px;
  height: 100vh;
  background-color: #f1f1f1;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  transform: translateX(100%);
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }sa
    ::-webkit-scrollbar-thumb {
        background: #FF8E53;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #FE6B8B;
    }
  }

  h2 {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 20px;
    font-color: #071330;
  }

  ul {
    font-family: 'Arial', sans-serif;
    font-size: 1em;
    padding-left: 20px;

    li {
      margin-bottom: 15px;
    }

`;

const Spinbox = styled.div`
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;

    &:hover {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
`;

const RightSidebarStyled = styled(StyledSidebar)`
    left: auto;
    right: 0;

    transform: translateX(100%);
    &.open {
        transform: translateX(0);
    }
`;

function RightSidebar(props) {
    if (!props.isOpen) return null;

    return (
        <RightSidebarStyled className={props.isOpen ? "open" : ""}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" onClick={props.onClose} />
            <h2>Create New</h2>

            <Spinbox>
                <h3>Question:</h3>
                <StyledInput
                    value={props.currentSpinName}
                    onChange={e => props.onSpinNameChange(e.target.value)}
                    placeholder="Enter spin name..."
                />
            </Spinbox>

            <Spinbox>
                <h3>Add New Option:</h3>
                <StyledInput
                    value={props.input}
                    onChange={e => props.onOptionInputChange(e.target.value)}
                    placeholder="Enter option..."
                />
            </Spinbox>

            <Spinbox style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={props.onAddOption}>Add</button>
                <button onClick={props.onResetOption}>Reset</button>
            </Spinbox>

        </RightSidebarStyled>
    );
}

export default RightSidebar;
