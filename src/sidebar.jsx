import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SidebarStyled = styled.div`
  position: absolute;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #f1f1f1;
  padding: 10px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto; // In case the history gets too long
  transform: translateX(100%);
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
  }
`;

const Decision = styled.div`
  margin: 10px 0;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

class Sidebar extends React.Component {
    state = {
        editingOptionId: null,
        editingSpinId: null,
        tempOptionText: ''
    };

    handleStartEdit = (spinId, optionIndex, optionText) => {
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
        const { isOpen, onClickDecision, onClickEditDecision, onClickDeleteEntireSpin, allSpins, onClickDeleteOption } = this.props;
        //const { allSpins } = this.state;

        return (
            <SidebarStyled className={isOpen ? "open" : ""}>
                <h2>Previous Spins</h2>
                <ul>
                {allSpins.map(spin => (
                        <li key={spin.id} onClick={() => onClickDecision(spin)}>
                            <div>Name: {spin.spin_name}</div>
                            <div>Options:
                                <ul>
                                    {spin.options.map((option, index) => (
                                        <li key={index}>
                                            {this.state.editingSpinId === spin.id && this.state.editingOptionId === index ? (
                                                <>
                                                    <input
                                                        value={this.state.tempOptionText}
                                                        onChange={this.handleOptionChange}
                                                    />
                                                    <button onClick={() => this.handleSaveEdit(spin.id, index)}>Save</button>
                                                </>
                                            ) : (
                                                <>
                                                    {option}
                                                    <button onClick={() => this.handleStartEdit(spin.id, index, option)}>Edit</button>
                                                    <button onClick={() => this.props.onClickDeleteOption(spin.id, index, option)}>Delete</button>
                                                </>
                                            )}
                                        </li>

                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => this.props.onClickDeleteEntireSpin(spin.id)}>Delete Spin</button>

                        </li>
                    ))}
                </ul>
            </SidebarStyled>
        );
    }
}

export default Sidebar;