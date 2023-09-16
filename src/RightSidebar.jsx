import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StyledInput } from './WheelStyles.jsx';

const StyledSidebar = styled.div`
  z-index: 10;
  position: absolute;
  right: 0;
  width: 25vw;
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
    font-family: Luminari, fantasy;
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 20px;
    font-color: #071330;
  }

  h3 {
    font-family: Luminari, fantasy;
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 20px;
    font-color: #071330;
  }

  ul {
    font-family: Luminari, fantasy;
    font-size: 1.1em;
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

// const Headers = styled.div`
//   font-family: 'Luminari', fantasy;
//   font-weight: bold;
//   font-size: 1.5em;
//   margin-bottom: 20px;
//   font-color: #071330;
// `

const RightSidebarButton = styled.div`

  appearance: none;
  background-color: #FAFBFC;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292E;
  cursor: pointer;
  display: inline-block;
  font-family: Luminari, fantasy;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;


&:hover {
  background-color: #F3F4F6;
  text-decoration: none;
  transition-duration: 0.1s;
}


.button-4:focus {
  outline: 1px transparent;
}

.button-4:before {
  display: none;
}

.button-4:-webkit-details-marker {
  display: none;
}
`

function RightSidebar(props) {
    if (!props.isOpen) return null;

    return (
        <StyledSidebar className={props.isOpen ? "open" : ""}>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" onClick={props.onClose} />
            <h2>Create New</h2>

            <Spinbox>
                <h3>Question:</ h3>
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
                <RightSidebarButton onClick={props.onAddOption}>Add</RightSidebarButton>
                <RightSidebarButton onClick={props.onResetOption}>Reset</RightSidebarButton>
            </Spinbox>

        </StyledSidebar>
    );
}

export default RightSidebar;
