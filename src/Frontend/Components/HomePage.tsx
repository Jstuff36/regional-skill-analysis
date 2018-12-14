import * as React from 'react';
import '../Styles/HomePage.css';
import { connect } from 'react-redux';
import { Input, InputOnChangeData, Divider, List, Checkbox, Dropdown, DropdownItemProps, DropdownProps, CheckboxProps, Button } from 'semantic-ui-react';
import { StoreState } from '../Reducers/rootReducer';
import { JobsStore } from '../Reducers/jobsReducer';

// TODO: move this to a common place
export interface SkillCheckBoxOptions {
    value: string;
    checked: boolean;
}

interface State {
    zipCode: string;
    skillCheckBoxOptions: SkillCheckBoxOptions[];
    dropdownOptions: DropdownItemProps[];
}

interface StateProps {
    skills: string[];
    jobs: JobsStore;
}

type Props = StateProps

class HomePageComponent extends React.Component<Props, State> {

    // TODO: If this is not changed from the job form component then refactor checkbox/search part into own component
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
        if (state.skillCheckBoxOptions.length === 0 && state.dropdownOptions.length === 0) {
            const dropdownOptions: DropdownItemProps[] = props.skills.map(skill => ({
                key: skill,
                text: skill,
                value: skill
            }))
            const skillCheckBoxOptions: SkillCheckBoxOptions[] = props.skills.map(skill => ({
                value: skill,
                checked: false
            }))
            return {
                dropdownOptions,
                skillCheckBoxOptions
            }
        }
        return {};
    }

    state: State = {
        zipCode: '',
        skillCheckBoxOptions: [],
        dropdownOptions: []
    }

    handleZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ zipCode: value });

    handleSearchSelect = (e: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
        // Need to cast e here because React SUI has incorrectly typed the event
        if (e.type === 'click' || (e as unknown as KeyboardEvent).key === "Enter") { 
            this.setState(({skillCheckBoxOptions: oldCheckBoxOptions}) => {
                const newCheckBoxOptions = oldCheckBoxOptions.map(option => {
                    if (value === option.value) {
                        return {
                            ...option,
                            checked: true
                        }
                    } else {
                        return option;
                    }
                })
                return {skillCheckBoxOptions: newCheckBoxOptions}
            })
        }
    }

    handleCheckBoxSelection = (_: React.MouseEvent<HTMLInputElement>, {label}: CheckboxProps) => {
        this.setState(({ skillCheckBoxOptions: oldCheckBoxOptions }) => {
            const newCheckBoxOptions = oldCheckBoxOptions.map(option => {
                if (label === option.value) {
                    return {
                        ...option,
                        checked: !option.checked
                    }
                } else {
                    return option;
                }
            })
            return { skillCheckBoxOptions: newCheckBoxOptions }
        })
    }

    renderJobOptions = () => {
        const {zipCode, skillCheckBoxOptions} = this.state;
        const {jobs} = this.props;
        
        const jobIdMatches = Object.keys(jobs).filter(id => jobs[id].zipCode === zipCode);
        const checkedSkills = skillCheckBoxOptions.filter(({checked}) => checked);

        if (jobIdMatches.length > 0) {
            return (
                <div>
                    {
                        jobIdMatches.map(id => {
                            const skillMatches = checkedSkills.filter(
                                ({value}) => jobs[id].skills.find(jobSkill => jobSkill === value)
                            );
                            const numSkillMatches = skillMatches.length;
                            const numSkillsMissing = Math.max(jobs[id].skills.length - numSkillMatches, 0);
                            return (
                                <div key={id}>
                                    <div>
                                        {jobs[id].position}
                                    </div>
                                    <div>
                                        {`${numSkillMatches} skills in common`}
                                        {`${numSkillsMissing} missing skills`}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div>There are no job postings in your ZIPcode</div>
            )
        }
    }

    render() {

        const {dropdownOptions, skillCheckBoxOptions, zipCode} = this.state;

        return (
            <div className="homePageContainer">
                <div className="leftSide">
                    <div className="header">Enter a ZIP Code</div>
                    <Input 
                        className={"inputClass"}
                        placeholder={"i.e. 11222"}
                        fluid
                        value={zipCode}
                        onChange={this.handleZipCodeChange}
                    />
                    <Divider horizontal>Or</Divider>
                    <div className="header">Browse Jobs in Your Area</div>
                    {
                        zipCode.length < 5 ?
                            <div className="noZipCodeText">
                                Enter a ZIP code to begin browsing jobs
                            </div>
                            :
                            <div>
                                <div>
                                    <Button attached='left'>List</Button>
                                    <Button attached='right'>Map</Button>
                                </div>
                                {this.renderJobOptions()}                                
                            </div>
                    }
                </div>  
                <div className="rightSide">
                    <div className="header">Select skills to narrow the search</div>
                    <div className={"inputClass"}>
                        <Dropdown 
                            placeholder='Search...' 
                            fluid
                            search
                            selection
                            options={dropdownOptions}  
                            onChange={this.handleSearchSelect} 
                        />
                    </div>
                    <List>
                        {
                            skillCheckBoxOptions.map(({value, checked}) => (
                                <List.Item>
                                    <Checkbox 
                                        checked={checked} 
                                        label={value}
                                        onClick={this.handleCheckBoxSelection}
                                    />
                                </List.Item>
                            ))
                        }
                    </List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: StoreState): StateProps => {
    const {jobsStore} = store;
    // TODO move skills into a reducer later
    return {
        jobs: jobsStore,
        skills: ['CNC Programming', 'CAD', '3D Printing', 'Teamwork', 'Problem Solving', 'Design']
    }
}

export const HomePage = connect(mapStateToProps)(HomePageComponent);