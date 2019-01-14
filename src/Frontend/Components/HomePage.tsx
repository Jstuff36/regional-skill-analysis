import * as React from 'react';
import '../Styles/HomePage.css';
import { connect } from 'react-redux';
import { Input, InputOnChangeData, Divider, List, DropdownItemProps, Button, Form } from 'semantic-ui-react';
import { StoreState } from '../Reducers/rootReducer';
import { JobsStore, Job, jobActionCreators } from '../Reducers/jobsReducer';
import { Link } from 'react-router-dom';
import { SkillSearchSelection } from './Employer/SkillSearchSelection';
import { SemanticShorthandItem, HtmlLabelProps } from 'semantic-ui-react/dist/commonjs/generic';
import Axios, { CancelTokenSource } from 'axios';

// TODO: move this to a common place
export interface SkillCheckBoxOptions {
    value: string;
    checked: boolean;
}

type DispatchProps = typeof jobActionCreators;

interface State {
    zipCode: string;
    skillCheckBoxOptions: SkillCheckBoxOptions[];
    dropdownOptions: DropdownItemProps[];
    jobs: Job[];
}

interface StateProps {
    skills: string[];
    jobsStore: JobsStore;
}

type Props = StateProps & DispatchProps;

class HomePageComponent extends React.Component<Props, State> {

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
        } else {
            return {
                jobs: props.jobsStore[state.zipCode] || []
            }
        }
    }

    private cancelToken: CancelTokenSource;

    state: State = {
        zipCode: '',
        skillCheckBoxOptions: [],
        dropdownOptions: [],
        jobs: []
    }

    handleZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        const {addAllJobsByZipCode} = this.props;
        this.setState({ zipCode: value }, () => {
            const {zipCode} = this.state;
            if (this.cancelToken) {
                this.cancelToken.cancel();
            }
            if (zipCode.length > 4) {
                this.cancelToken = Axios.CancelToken.source();
                Axios.get<Job[]>(`/api/v1/jobs/all-by-zipCode/${zipCode}`, {
                    cancelToken: this.cancelToken.token
                }).then(resp => addAllJobsByZipCode({jobs: resp.data, zipCode}))
            }
        });

    }

    handleSearchSelect = (e: React.SyntheticEvent<HTMLElement>, value: string) => {
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

    renderJobOptions = () => {
        const {skillCheckBoxOptions, jobs} = this.state;
        const checkedSkills = skillCheckBoxOptions.filter(({checked}) => checked);

        if (jobs.length > 0) {
            return (
                <div className="jobsContainer">
                    {
                        jobs.map((job, idx) => {
                            const skillMatches = checkedSkills.filter(
                                ({value}) => job.skills.find(jobSkill => jobSkill === value)
                            );
                            const numSkillMatches = skillMatches.length;
                            const numSkillsMissing = Math.max(job.skills.length - numSkillMatches, 0);
                            
                            return (
                                <React.Fragment key={job.id}>
                                    <List>
                                        <List.Item>
                                            <div className={"singleJobContainer"}>
                                                <div>
                                                    <div className="jobTitle">
                                                        {job.position}
                                                    </div>
                                                    <List className="skillsSummary">
                                                        <List.Item>
                                                            {`${numSkillMatches} skills in common`}
                                                        </List.Item>
                                                        <List.Item>
                                                            {`${numSkillsMissing} missing skills`}
                                                        </List.Item>
                                                    </List>
                                                </div>
                                                <Link
                                                    className="viewJobButton" 
                                                      to={{
                                                        pathname: `/job/${job.id}`,
                                                        state: {skillMatches: skillMatches.map(({ value }) => value)}
                                                    }}
                                                >
                                                    <Button style={{height: 40}} content={"View Job"}/>
                                                </Link>
                                            </div>
                                        </List.Item>
                                    </List>
                                    {idx < jobs.length - 1 ? <Divider/> : null}
                                </React.Fragment>
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
                    <Divider horizontal>Then</Divider>
                    <div className="header jobsHeaderContainer">
                        <div>Browse Jobs in Your Area</div>
                        <div>
                            <Button disabled={zipCode.length < 5} attached='left'>List</Button>
                            <Button disabled={zipCode.length < 5} attached='right'>Map</Button>
                        </div>
                    </div>

                    {
                        zipCode.length < 5 ?
                            <div className="noZipCodeText">
                                Enter a ZIP code to begin browsing jobs
                            </div>
                            :
                            this.renderJobOptions()
                    }
                </div>  
                <div className="rightSide">
                    <div className="header">Select skills to narrow the search</div>
                    <Form className="skillForm">
                        <SkillSearchSelection
                            dropdownOptions={dropdownOptions}
                            skillCheckBoxOptions={skillCheckBoxOptions}
                            onCheckboxUpdate={this.handleCheckBoxSelection}
                            onSearchUpdate={this.handleSearchSelect}
                            hideLabel
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: StoreState): StateProps => {
    const {jobsStore} = store;
    // TODO move skills into a reducer later
    return {
        jobsStore,
        skills: ['CNC Programming', 'CAD', '3D Printing', 'Teamwork', 'Problem Solving', 'Design']
    }
}

export const HomePage = connect(mapStateToProps, jobActionCreators)(HomePageComponent);