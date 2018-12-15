import * as React from 'react';
import { Job } from 'src/Frontend/Reducers/jobsReducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { connect } from 'react-redux';
import { Icon, List } from 'semantic-ui-react';
import '../../Styles/JobDrillDown.css';

interface StateProps {
    job: Job;
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
                                    skillMatches.map(skill => (
                                        <List.Item>
                                            <div className="skillContainer">
                                                <Icon name="checkmark" color="green" />
                                                <div>{skill}</div>
                                            </div>
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
                            <div className="title">Skills Missing</div>
                            <List>
                                {
                                    skillsMissing.map(skill => (
                                        <List.Item>
                                            <div className="skillContainer">
                                                <Icon name="delete" color="red" />
                                                <div>{skill}</div>
                                            </div>
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
                {this.renderSkillsSection()}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState, ownProps: RouteComponentProps<{id: string}>): StateProps => {
    const {jobsStore} = state;
    const {match: {params: {id}}} = ownProps;
    return {
        job: jobsStore[id]
    }
}

export const JobDrilldown = withRouter(connect<StateProps>(mapStateToProps)(JobDrilldownComponent))