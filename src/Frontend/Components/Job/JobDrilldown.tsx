import * as React from 'react';
import { Job } from 'src/Frontend/Reducers/jobsReducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { connect } from 'react-redux';
import { Icon, List, Divider } from 'semantic-ui-react';
import '../../Styles/JobDrillDown.css';
import { Course } from 'src/Frontend/Reducers/coursesReducer';

interface StateProps {
    job: Job;
    courses: Course[];
}

type Props = StateProps & RouteComponentProps<{id: string}, {}, {skillMatches: string[]}>

class JobDrilldownComponent extends React.Component<Props> {

    renderSkillsSection = () => {

        const { job, location: { state }} = this.props;

        const skillMatches = state ? state.skillMatches : [];
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

    render() {

        const {job} = this.props;

        return (
            <div className="jobDrillDownContainer">
                <div className="title">{job.position}</div>
                <div className="description">{job.description}</div>
                <Divider/>
                {this.renderSkillsSection()}
                <Divider/>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState, ownProps: RouteComponentProps<{id: string}>): StateProps => {
    const {jobsStore, coursesStore} = state;
    const {match: {params: {id}}} = ownProps;
    const job = jobsStore[id]
    return {
        job,
        courses: coursesStore[job.zipCode]
    }
}

export const JobDrilldown = withRouter(connect<StateProps>(mapStateToProps)(JobDrilldownComponent))