import * as React from 'react';
import { Job } from 'src/Frontend/Reducers/jobsReducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { connect } from 'react-redux';
import { Icon, List, Divider, Accordion } from 'semantic-ui-react';
import '../../Styles/JobDrillDown.css';
import { Course, coursesActions } from 'src/Frontend/Reducers/coursesReducer';
import axios from 'axios';

interface StateProps {
    courses: Course[];
}

type DispatchProps = typeof coursesActions;

type Props = StateProps & RouteComponentProps<{ id: string }, {}, { skillMatches: string[], job: Job }> & DispatchProps;

class JobDrilldownComponent extends React.Component<Props> {

    componentDidMount() {
        const {addAllCoursesByZipCode, location: {state: {job: {zipCode}}}} = this.props;
        axios.get<Course[]>(`/api/v1/courses/all-by-zipCode/${zipCode}`)
            .then(resp => addAllCoursesByZipCode({courses: resp.data, zipCode}))
            .catch(err => console.log(err));
    }

    renderSkillsSection = () => {

        const { location: { state: { skillMatches = [], job } } } = this.props;

        const skillsMissing = job.skills.filter(skill => !skillMatches.find(skillMatch => skillMatch === skill));
        return (
            <div>
                {
                    skillMatches.length > 0 ?
                        <>
                            <div className="title">Skills In Common</div>
                            <List>
                                {
                                    skillMatches.map((skill, idx) => (
                                        <List.Item key={idx}>
                                            <Icon name="checkmark" color="green" />
                                            <List.Content className="skillContainer">
                                                <div>{skill}</div>
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </>
                        :
                        null
                }
                {
                    skillsMissing.length > 0 ?
                        <>
                            <div className="title">Skills Needed to Apply</div>
                            <List>
                                {
                                    skillsMissing.map((skill, idx) => (
                                        <List.Item key={idx}>
                                            <Icon name="delete" color="red" />
                                            <List.Content className="skillContainer">
                                                {skill}
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </>
                        :
                        null
                }
            </div>
        )
    }

    renderCoursesSection = () => {
        const {location: {state: {skillMatches = [], job}}} = this.props;

        const skillsMissing = job.skills.filter(skill => !skillMatches.find(skillMatch => skillMatch === skill));
        return (
            <div className="title">
                <div>Courses Avaliable in Your Area</div>
                <Accordion className="courseListings" styled fluid>
                    {
                        skillsMissing.map(skill => (
                            <Accordion.Title className="course" key={skill}>
                                {skill}
                            </Accordion.Title>
                        ))
                    }
                </Accordion>
            </div>
        );
    }

    render() {

        const {location: {state: {job}}} = this.props;

        return (
            <div className="jobDrillDownContainer">
                <div className="title">{job.position}</div>
                <div className="description">{job.description}</div>
                <Divider/>
                {this.renderSkillsSection()}
                <Divider/>
                {this.renderCoursesSection()}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState, ownProps: RouteComponentProps<{id: string}>): StateProps => {
    const {coursesStore} = state;
    const { location: { state: { job } } } = ownProps;

    return {
        courses: coursesStore[job.zipCode]
    }
}

export const JobDrilldown = withRouter(connect<StateProps>(mapStateToProps)(JobDrilldownComponent))