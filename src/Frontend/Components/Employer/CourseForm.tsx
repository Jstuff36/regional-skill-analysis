import * as React from 'react';
import { connect } from 'react-redux';
import { Course, coursesActions } from 'src/Frontend/Reducers/coursesReducer';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { List, Icon, Form, InputOnChangeData, TextAreaProps, DropdownItemProps, SemanticShorthandItem } from 'semantic-ui-react';
import '../../Styles/CourseForm.css';
import { SkillSearchSelection } from './SkillSearchSelection';
import { SkillCheckBoxOptions } from '../HomePage';
import { HtmlLabelProps } from 'semantic-ui-react/dist/commonjs/generic';
import axios from 'axios';
import { backendBaseURL } from 'src/Frontend/EnvConstants';
const uuidv1 = require('uuid/v1');

interface StateProps {
    courses: Course[];
    skills: string[];
}

interface State {
    name: string;
    description: string;
    zipCode: string;
    skillCheckBoxOptions: SkillCheckBoxOptions[];
    dropdownOptions: DropdownItemProps[];
}

type DispatchProps = typeof coursesActions;

type Props = StateProps & DispatchProps;

class CourseFormComponent extends React.Component<Props, State> {

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
        name: '',
        description: '',
        zipCode: '',
        skillCheckBoxOptions: [],
        dropdownOptions: []
    }

    removeCourse = (course: Course) => {
        const {removeCourse} = this.props;
        removeCourse({course});
    }

    onNameChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ name: value });
    onZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ zipCode: value });
    onDescriptionChange = (_: React.FormEvent<HTMLTextAreaElement>, { value }: TextAreaProps) => this.setState({ description: value as string });

    isButtonDisabled = (): boolean => {
        const { name, zipCode } = this.state;
        return (name.length === 0 || zipCode.length < 5)
    }

    postCourse = () => {
        const {addCourse} = this.props;
        const {name, description, zipCode, skillCheckBoxOptions} = this.state;
        const newCourse: Course = {
            name,
            zipCode,
            description,
            id: uuidv1(),
            skills: skillCheckBoxOptions.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        }
        
        axios.post<Course>(`${backendBaseURL}/api/v1/courses`, newCourse)
            .then(resp => {
                addCourse(resp.data)
            })
            .catch(err => console.log(err));
    }

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

    renderCourseForm = () => {
        const {description, name, zipCode, skillCheckBoxOptions, dropdownOptions} = this.state;
        return (
            <Form>
                <Form.Input
                    label={'Name'}
                    placeholder={'Name'}
                    onChange={this.onNameChange}
                    required
                    value={name}
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
                    onChange={this.onDescriptionChange}
                    rows={5}
                    value={description}
                />
                <SkillSearchSelection
                    skillCheckBoxOptions={skillCheckBoxOptions}
                    dropdownOptions={dropdownOptions}
                    onCheckboxUpdate={this.handleCheckBoxSelection}
                    onSearchUpdate={this.handleSearchSelect}
                />
                <Form.Button
                    disabled={this.isButtonDisabled()}
                    content={'Post Course'}
                    onClick={this.postCourse}
                />
            </Form>
        )
    }

    renderCoursePostings = () => {
        const {courses = []} = this.props;
        if (courses.length === 0) {
            return <div>No Courses Posted</div>
        } else {
            return (
                <List>
                    {
                        courses.map(course => (
                            <List.Item className="jobPosting">
                                <Icon name="delete" onClick={() => this.removeCourse(course)} color={"red"} />
                                <List.Content>
                                    {course.name}
                                </List.Content>
                            </List.Item>
                        ))
                    }
                </List>
            )
        }
    }

    render() {
        return (
            <div className="courseFormContainer">
                <div className="leftSide">
                    <div className="header">Create A Course Posting</div>
                    {this.renderCourseForm()}
                </div>
                <div className="rightSide">
                    <div className="header">Current Course Postings</div>
                    {this.renderCoursePostings()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store: StoreState): StateProps => {
    const {coursesStore} = store;
    // Change the array idx later
    return {
        courses: coursesStore[''],
        skills: ['CNC Programming', 'CAD', '3D Printing', 'Teamwork', 'Problem Solving', 'Design']
    }
}

export const CourseForm = connect<StateProps, DispatchProps>(mapStateToProps, coursesActions)(CourseFormComponent)

