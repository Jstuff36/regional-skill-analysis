import * as React from 'react';
import { connect } from 'react-redux';
import '../../Styles/JobForm.css';
import { Form, InputOnChangeData, DropdownItemProps, List, Icon, TextAreaProps } from 'semantic-ui-react';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { SkillCheckBoxOptions } from '../HomePage';
import { jobActions, JobsStore } from 'src/Frontend/Reducers/jobsReducer';
import { SkillSearchSelection } from './SkillSearchSelection';
import { SemanticShorthandItem, HtmlLabelProps } from 'semantic-ui-react/dist/commonjs/generic';
import { backendBaseURL } from 'src/Frontend/EnvConstants';
// const uuidv4 = require('uuid/v4');

interface State {
    position: string;
    zipCode: string;
    jobDescription: string;
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
        dropdownOptions: [],
        jobDescription: ''
    }

    onPositionChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ position: value });
    onZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ zipCode: value });
    onJobDescriptionChange = (_: React.FormEvent<HTMLTextAreaElement>, { value }: TextAreaProps) => this.setState({ jobDescription: value as string });

    handleSearchSelect = (e: React.SyntheticEvent<HTMLElement>, value: string) => {
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

    handleCheckBoxSelection = (_: React.MouseEvent<HTMLInputElement>, label: SemanticShorthandItem<HtmlLabelProps>) => {
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
        // Make an axios post here then send addJob action
        // const id = uuidv4();
        // const newJob: Job = {
        //     zipCode,
        //     position,
        //     skills: skillCheckBoxOptions.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        // }
        // fetch(`localhost8080:/job/${id}`, newJob).then(
        //     resp => resp.body
        // ).catch(
        //     console.log("some error")
        // )
        console.log(backendBaseURL);
        addJob({
            zipCode,
            position,
            skills: skillCheckBoxOptions.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        })  
    }

    isButtonDisabled = (): boolean => {
        const {position, zipCode} = this.state;
        return (position.length === 0 || zipCode.length < 5)
    }

    renderJobForm = () => {
        const { position, zipCode, skillCheckBoxOptions, dropdownOptions, jobDescription } = this.state;
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
                <Form.TextArea
                    label={'Job Description'}
                    placeholder={'Job Description'}
                    onChange={this.onJobDescriptionChange}
                    rows={5}
                    value={jobDescription}
                />
                <SkillSearchSelection
                    skillCheckBoxOptions={skillCheckBoxOptions}
                    dropdownOptions={dropdownOptions}
                    onCheckboxUpdate={this.handleCheckBoxSelection}
                    onSearchUpdate={this.handleSearchSelect}
                />
                <Form.Button 
                    disabled={this.isButtonDisabled()}
                    content={'Post Job'} 
                    onClick={this.postJob}
                />
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
                            <List.Item key={jobID} className="jobPosting">
                                <Icon name="delete" onClick={() => removeJob({ id: jobID })} color={"red"} />
                                <List.Content>
                                    {jobs[jobID].position}
                                </List.Content>
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