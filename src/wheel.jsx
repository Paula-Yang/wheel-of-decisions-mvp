import React from "react";
import axios from 'axios';
import Sidebar from './sidebar.jsx';
import { WheelContainer, WheelStyled, WheelItem, SpinButton, Wrapper, GlobalStyles } from './WheelStyles.jsx';


export default class Wheel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            input: '',
            allSpins: [],
            selectedItem: null,
            excelData: [],
            isSidebarOpen: false,
            currentSpinName: '',
        };
    }

    componentDidMount() {

        axios.get('/spins')
            .then(response => {
                this.setState({ allSpins: response.data });
            })
            .catch(error => {
                console.error("Error fetching spins:", error);
            });
    }

    handleAddOption = (e) => {
        e.stopPropagation(); //stop event propagation to prevent auto spin
        const { options, input, editingDecisionId } = this.state;

        if (editingDecisionId) {
            this.updateExistingSpin(editingDecisionId, input.split(',').map(item => item.trim()));
        } else if (input.trim() !== '') {
            this.setState({
                options: [...options, input],
                input: ''
            });
        }
    }

    handleDeleteDecision = (spinId) => {
        axios.delete(`/spin/${spinId}`)
            .then(() => {
                this.setState(prevState => ({
                    allSpins: prevState.allSpins.filter(spin => spin.id !== spinId)
                }));
            })
            .catch(error => {
                console.error("Error deleting spin:", error);
            });
    }

    handleDeleteOption = (spinId, optionIndex) => {
        axios.delete(`/spin/${spinId}/option/${optionIndex}`)
        .then(() => {
            this.setState(prevState => {
                const allSpins = [...prevState.allSpins];
                const spin = allSpins.find(s => s.id === spinId);
                if (spin) {
                    spin.options.splice(optionIndex, 1);
                }
                return { allSpins };
            });
        })
        .catch(error => {
            console.error("Error deleting option:", error);
        });
    }


    handleResetOption = () => {
        this.setState({ options: [] });
    }


    handleSpin = () => {
        if (this.state.selectedItem === null) {
            const selectedItem = Math.floor(Math.random() * this.state.options.length);
            this.setState({ selectedItem });
            const spinResult = this.state.options[selectedItem];

            const newSpin = { name: this.state.currentSpinName, result: spinResult, options: this.state.options };



            axios.post('/spin', newSpin)
                .then(response => {
                    this.setState({ allSpins: [...this.state.allSpins, response.data],
                        currentSpinName: ''
                    });
                })
                .catch(error => {
                    console.error("Error saving spin result:", error);
                });

            this.setState(state => ({
                excelData: [...state.excelData, {
                    try: state.excelData.length + 1,
                    item: spinResult,
                    timestamp: new Date().toLocaleTimeString(),
                }]
            }));
        } else {
            this.setState({ selectedItem: null });
            setTimeout(this.handleSpin, 500);
        }
    }

    handleEditDecision = (decision) => {
        this.setState({
            input: decision.options.join(', '),
            editingDecisionId: decision.id
        });
    }

    updateExistingSpin = (id, newOptions) => {
        axios.put(`/spin/${id}`, {
            options: newOptions
        })
        .then(response => {
            //update the local state with the edited decision
            this.setState(prevState => ({
                allSpins: prevState.allSpins.map(spin =>
                    spin.id === id ? response.data : spin
                ),
                input: '',
                editingDecisionId: null
            }));
        })
        .catch(error => {
            console.error("Error updating spin:", error);
        });
    }


    handleDecisionClick = (decision) => {
        this.setState({
            options: decision.options
        });
    }

    handleOptionEdit = (spinId, optionIndex, newText) => {
        axios.put(`/spin/${spinId}/option/${optionIndex}`, {
            option: newText
        })
        .then(() => {
            this.setState(prevState => {
                const allSpins = [...prevState.allSpins];
                const spin = allSpins.find(s => s.id === spinId);
                if (spin) {
                    spin.options[optionIndex] = newText;
                }
                return { allSpins };
            });
        })
        .catch(error => {
            console.error("Error updating option:", error);
        });
    }

    toggleSidebar = () => {
        console.log("Current sidebar state:", this.state.isSidebarOpen);
        this.setState(prevState => ({
        isSidebarOpen: !prevState.isSidebarOpen
    }));
    }

    render() {
        const { options, input, allSpins, selectedItem, excelData } = this.state;
        const spinning = selectedItem !== null ? "spinning" : "";
        const wheelVars = {
			"--nb-item": options.length,
			"--selected-item": selectedItem,
		};

        return (
            <>
            <GlobalStyles />
            <button onClick={this.toggleSidebar}>ShowHistory</button>
            <Sidebar
               isOpen={this.state.isSidebarOpen}
               allSpins={this.state.allSpins}
               onClickDecision={this.handleDecisionClick}
               onClickEditDecision= {this.handleEditDecision}
               onClickDeleteDecision = {this.handleDeleteDecision}
               onClickDeleteOption = {this.handleDeleteOption}
               onOptionEdit={this.handleOptionEdit}

            >

            </Sidebar>
            <WheelContainer>
                <Wrapper>
                    <WheelStyled
                        className={spinning}
                        style={wheelVars}
                        onClick={this.handleSpin}
                    >
                        {options.map((option, index) => (
                            <WheelItem
                            key={index}
                            style={{ "--item-nb": index }}
                        >
                                {option}
                                </WheelItem>
                        ))}
                    </WheelStyled>
                    </Wrapper>
                    <Wrapper>
                    <div>
                        <input
                            value={this.state.currentSpinName}
                            onChange={e => this.setState({ currentSpinName: e.target.value })}
                            placeholder="Enter spin name..."
                        />
                        <input
                            value={input}
                            onChange={e => this.setState({ input: e.target.value })}
                            placeholder="Enter option..."
                        />
                        <button onClick={this.handleAddOption}>Add</button>
                        <button onClick={this.handleResetOption}>Reset</button>
                        <SpinButton onClick={this.handleSpin}>Spin!</SpinButton>
                    </div>
                </Wrapper>
            </WheelContainer>
            </>
        );

    }
}
