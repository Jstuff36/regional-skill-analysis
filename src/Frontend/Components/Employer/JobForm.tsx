import * as React from 'react';
import { connect } from 'react-redux';
import '../../Styles/JobForm.css';
import { Form, InputOnChangeData, DropdownItemProps, DropdownProps, CheckboxProps, List, Icon } from 'semantic-ui-react';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { SkillCheckBoxOptions } from '../HomePage';
import { jobActions, JobsStore } from 'src/Frontend/Reducers/jobsReducer';

interface State {
    position: string;
    zipCode: string;
    skillCheckBoxOptions: SkillCheckBoxOptions[];
    dropdownOptions: DropdownItemProps[];
}

interface StateProps {
    skills: string[];
    jobs: JobsStore;
}

type DispatchProps = typeof jobActions;

type Props = StateProps & DispatchProps;

class JobFormComponent extends React.Component<Props, State> {

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
        position: '',
        zipCode: '',
        skillCheckBoxOptions: [],
        dropdownOptions: []
    }

    onPositionChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ position: value });
    onZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ zipCode: value });

    handleSearchSelect = (e: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
        // Need to cast e here because React SUI has incorrectly typed the event
        if (e.type === 'click' || (e as unknown as KeyboardEvent).key === "Enter") {
            this.setState(({ skillCheckBoxOptions: oldCheckBoxOptions }) => {
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
                return { skillCheckBoxOptions: newCheckBoxOptions }
            })
        }
    }

    handleCheckBoxSelection = (_: React.MouseEvent<HTMLInputElement>, { label }: CheckboxProps) => {
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

    postJob = () => {
        const {zipCode, position, skillCheckBoxOptions} = this.state;
        const {addJob} = this.props;
        addJob({
            zipCode,
            position,
            skills: skillCheckBoxOptions.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        })
    }

    renderJobForm = () => {
        const { position, zipCode, skillCheckBoxOptions, dropdownOptions } = this.state;
        return (
            <Form>
                <Form.Input
                    label={'Position'}
                    placeholder={'Position'}
                    onChange={this.onPositionChange}
                    required
                    value={position}
                />
                <Form.Input
                    label={'ZIP Code'}
                    placeholder={'ZIP Code'}
                    onChange={this.onZipCodeChange}
                    required
                    value={zipCode}
                />
                <Form.Field>
                    <label>Select Required Skills</label>
                    <Form.Dropdown
                        required
                        labeled
                        placeholder={'Search...'}
                        fluid
                        search
                        selection
                        options={dropdownOptions}
                        onChange={this.handleSearchSelect}
                    />
                    {
                        skillCheckBoxOptions.map(({ value, checked }) => (
                            <Form.Checkbox
                                checked={checked}
                                label={value}
                                onClick={this.handleCheckBoxSelection}
                            />
                        ))
                    }
                </Form.Field>
                <Form.Button content={'Post Job'} onClick={this.postJob}/>
            </Form>
        )
    }

    renderJobPosting = () => {
        const { jobs, removeJob } = this.props;
        if (Object.keys(jobs).length > 0) {
            return(
                <List>
                    {
                        Object.keys(jobs).map(jobID => (
                            <List.Item className="jobPosting">
                                <Icon name="delete" onClick={() => removeJob({ id: jobID })} color={"red"} />
                                {jobs[jobID].position}
                            </List.Item>
                        ))
                    }
                </List>
            )
        } else {
            return <div>No Jobs Posted</div>;
        }
    }

    render() {
        return (
            <div className="jobFormContainer">
                <div className="leftSide">
                    <div className="header">Create A Job Posting</div>
                    {this.renderJobForm()}
                </div>
                <div className="rightSide">
                    <div className="header">Current Job Postings</div>
                    {this.renderJobPosting()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: StoreState): StateProps => {
    const {jobsStore} = store;
    return {
        jobs: jobsStore,
        skills: ['CNC Programming', 'CAD', '3D Printing', 'Teamwork', 'Problem Solving', 'Design']
    }
}

export const JobForm = connect<StateProps, DispatchProps>(mapStateToProps, jobActions)(JobFormComponent)