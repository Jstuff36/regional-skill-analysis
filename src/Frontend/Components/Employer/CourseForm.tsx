import * as React from 'react';
import { connect } from 'react-redux';
import { Course, coursesActions } from 'src/Frontend/Reducers/coursesReducer';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { List, Icon, Form, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import '../../Styles/CourseForm.css';
const uuidv1 = require('uuid/v1');

interface StateProps {
    courses: Course[]
}

interface State {
    name: string;
    description: string;
    zipCode: string;
}

type DispatchProps = typeof coursesActions;

type Props = StateProps & DispatchProps;

class CourseFormComponent extends React.Component<Props, State> {

    state: State = {
        name: '',
        description: '',
        zipCode: ''
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
        const {name, description, zipCode} = this.state;
        const course: Course = {
            name,
            zipCode,
            description,
            id: uuidv1()
        }
        addCourse({course});
    }

    renderCourseForm = () => {
        const {description, name, zipCode} = this.state;
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
                <Form.Button
                    disabled={this.isButtonDisabled()}
                    content={'Post Job'}
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
        courses: coursesStore['']
    }
}

export const CourseForm = connect<StateProps, DispatchProps>(mapStateToProps, coursesActions)(CourseFormComponent)

