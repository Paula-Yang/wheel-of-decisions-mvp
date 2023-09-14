import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { StyledButton, StyledInput, LayoutWrapper, iOSFont } from './WheelStyles.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faMinusCircle, faTrashAlt, faCaretDown, faSave, faPlusCircle } from '@fortawesome/free-solid-svg-icons'


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

const CollapsibleSection = styled.div`
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;

    &.open {
        max-height: 500px;
    }
`;


const Decision = styled.div`
  margin: 10px 0;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const OptionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0; // Added vertical padding for each option.

    > *:not(:last-child) {
    margin-right: 15px; // Increased the space between items for better spacing.
    }
`;


const OptionContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    button {
    margin-left: 10px;  // Add space between buttons and option text.
    }
`;






class Sidebar extends React.Component {
    state = {
        editingOptionId: null,
        editingSpinId: null,
        tempOptionText: '',
        openSpinId: null
    };

    handleStartEdit = (spinId, optionIndex, optionText) => {
        // Inform parent that editing has started for a decision.
        this.props.onStartEditDecision(spinId);

        this.setState({
            editingSpinId: spinId,
            editingOptionId: optionIndex,
            tempOptionText: optionText
        });
    }


    handleOptionChange = (e) => {
        this.setState({
            tempOptionText: e.target.value
        });
    }

    handleSaveEdit = (spinId, optionIndex) => {
        this.props.onOptionEdit(spinId, optionIndex, this.state.tempOptionText);
        this.setState({ editingOptionId: null, editingSpinId: null, tempOptionText: '' });
    }

    // componentDidMount() {
    //     this.fetchSpins();
    // }


    render() {
        const { isOpen, onClickDecision, onClickEditDecision, onClickDeleteEntireSpin, allSpins, onClickDeleteOption, onOpenModal} = this.props;
        //const { allSpins } = this.state;

        return (
            <StyledSidebar className={isOpen ? "open" : ""}>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" onClick={() => this.props.onOpenModal()}/>
                <h2>Previous Spins</h2>
                <ul>
                {allSpins.map(spin => (
                    <Spinbox key={spin.id} onClick={() => onClickDecision(spin)}>
                    <LayoutWrapper onClick={() => this.setState({ openSpinId: this.state.openSpinId === spin.id ? null : spin.id })}>
                        <span>{spin.spin_name}</span>
                        <FontAwesomeIcon style= {{ cursor: 'pointer', size: 'lg'}} icon={faCaretDown} />
                    </LayoutWrapper>
                    <CollapsibleSection className={this.state.openSpinId === spin.id ? "open" : ""}>
                        <ul>
                        {spin.options.map((option, index) => (
                        <li key={index}>
                            <OptionContainer>
                            {this.state.editingSpinId === spin.id && this.state.editingOptionId === index ? (
                                <>
                                <StyledInput
                                    value={this.state.tempOptionText}
                                    onChange={this.handleOptionChange}
                                />
                                <FontAwesomeIcon icon={faSave} size="lg" onClick={() => this.handleSaveEdit(spin.id, index)}/>
                                </>
                            ) : (
                                <>
                                <span>{option}</span>
                                <div>
                                    <FontAwesomeIcon style={{ marginRight: '10px', cursor: 'pointer'}} onClick={() => this.handleStartEdit(spin.id, index, option)} icon={faEdit} size='lg' />
                                    <FontAwesomeIcon style= {{ cursor: 'pointer'}} onClick={() => this.props.onClickDeleteOption(spin.id, index, option)}icon={faMinusCircle} size='lg' />
                                </div>
                                </>
                            )}
                            </OptionContainer>
                            </li>
                        ))}
                        </ul>
                    </CollapsibleSection>
                    <FontAwesomeIcon style = {{cursor: 'pointer' }} icon={faTrashAlt} size="lg" onClick={() => this.props.onClickDeleteEntireSpin(spin.id)}/>
                    </Spinbox>
                ))}
                </ul>
            </StyledSidebar>
        );
    }
}

export default Sidebar;