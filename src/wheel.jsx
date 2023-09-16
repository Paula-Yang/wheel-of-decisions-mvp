import React from "react";
import axios from 'axios';
import Sidebar from './sidebar.jsx';
import { WheelContainer, WheelStyled, WheelItem, SpinButton, Wrapper, GlobalStyles, StyledButton, StyledInput, TopRightButton, InputContainer, Label, ParentContainer, Headers, faListIcon} from './WheelStyles.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import RightSidebar from './RightSidebar.jsx';


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
            isModalOpen: false
            //editingDecisionId: null
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

    handleDeleteEntireSpin = (spinId) => {
        axios.delete(`/spin/${spinId}`)
            .then(() => {
                this.setState(prevState => ({
                    allSpins: prevState.allSpins.filter(spin => spin.id !== spinId)
                }));
            })
            .catch(error => {
                console.error("Error deleting entire spin:", error);
            });
    }


    handleResetOption = (e) => {
        e.stopPropagation();
        this.setState({ options: [] });
    }

    handleEditDecision = (decision) => {
        this.setState({
            input: decision.options.join(', '),
            editingDecisionId: decision.id
        });
    }

    handleEditDecisionFromSidebar = (spinId) => {

        const decision = this.state.allSpins.find(spin => spin.id === spinId);
        if (decision) {
            //call handleEditDecision method if the decision is using a existed spin id
            this.handleEditDecision(decision);
        }
    }



    handleSpin = () => {
        const { selectedItem, currentSpinName, options, editingDecisionId } = this.state;


        if (this.state.selectedItem === null) {
            const selectedItem = Math.floor(Math.random() * this.state.options.length);
            this.setState({ selectedItem });
            const spinResult = this.state.options[selectedItem];

            const newSpin = { spin_name: this.state.currentSpinName, result: spinResult, options: this.state.options };

            //make sure it update the existing spin if updated an existing spin history
            console.log("editingDecisionId: ", editingDecisionId);
            if(editingDecisionId) {
                console.log("editingDecisionId exist ", editingDecisionId);
                //update the existing spin
                axios.put(`/spin/${editingDecisionId}/result`, newSpin)
                    .then(response => {
                        this.setState(prevState => ({
                            allSpins: prevState.allSpins.map(spin =>
                                spin.id === editingDecisionId ? response.data : spin
                            ),

                        }));
                    })
                    .catch(error => {
                        console.error("Error updating spin result:", error);
                    });
            } else {
                console.log("Creating a new spin");
                //create a new spin if not editing on existing spin
                axios.post('/spin', newSpin)
                    .then(response => {
                        this.setState({
                            allSpins: [...this.state.allSpins, response.data],
                            currentSpinName: '',
                            //editingDecisionId: null
                        });


                    })
                    .catch(error => {
                        console.error("Error saving spin result:", error);
                    });
            }

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
                input: ''
                //editingDecisionId: null
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

    handleAddOptionToSpin = (spinId, newOption) => {
        axios.put(`/spin/${spinId}/option`, { newOption })
            .then(response => {
                this.setState(prevState => {
                    const allSpins = [...prevState.allSpins];
                    const spin = allSpins.find(s => s.id === spinId);
                    if (spin) {
                        //update the options with the new set of options returned from the server
                        spin.options = response.data.options;
                    }

                    //upate the wheel
                    const wheelOptions = [...prevState.options, newOption];

                    return { allSpins, options: wheelOptions, newOption: '' };
                });
            })
            .catch(error => {
                console.error("Error adding option to spin:", error);
            });
    }



    toggleSidebar = () => {
        console.log("Current sidebar state:", this.state.isSidebarOpen);
        this.setState(prevState => ({
        isSidebarOpen: !prevState.isSidebarOpen
    }));
    }

    toggleModal = () => {
        this.setState(prevState => ({
            isModalOpen: !prevState.isModalOpen,
            input: '',
            options: [],
            selectedItem: null
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
            <ParentContainer>
            <Headers>Wheel of decision</Headers>
            <faListIcon>
            <FontAwesomeIcon style= {{
                cursor: 'pointer',
                position: 'absolute',
                top: '10px',
                right: '10px'
            }}  icon={faList} size='lg' onClick={this.toggleSidebar}/>
            </faListIcon>
            <Sidebar
               isOpen={this.state.isSidebarOpen}
               allSpins={this.state.allSpins}
               onClickDecision={this.handleDecisionClick}
               onClickDeleteOption = {this.handleDeleteOption}
               onClickDeleteEntireSpin ={this.handleDeleteEntireSpin}
               onOptionEdit={this.handleOptionEdit}
               //onEditDecision={this.handleEditDecision}
               onStartEditDecision={this.handleEditDecisionFromSidebar}
               onOpenModal={this.toggleModal}
               onAddOptionToSpin={this.handleAddOptionToSpin}
            />

            <RightSidebar
                    isOpen={this.state.isModalOpen}
                    input={this.state.input}
                    onOptionInputChange={value => this.setState({ input: value })}
                    onAddOption={this.handleAddOption}
                    onResetOption={this.handleResetOption}
                    currentSpinName={this.state.currentSpinName}
                    onSpinNameChange={value => this.setState({ currentSpinName: value })}
                    onClose={this.toggleModal}
                />

            <WheelContainer style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
                    <SpinButton onClick={this.handleSpin}>Spin!</SpinButton>
                    </WheelContainer>
                    <Wrapper>
                </Wrapper>
                </ParentContainer>
            </>
        );

    }
}
