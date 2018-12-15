import * as React from 'react';
import { Job } from 'src/Frontend/Reducers/jobsReducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

interface StateProps {
    job: Job;
}

type Props = StateProps & RouteComponentProps<{id: string}, {}, {skillMatches: string[]}>

class JobDrilldownComponent extends React.Component<Props> {

    render() {

        const { job, location: {state: {skillMatches = []}} } = this.props;

        return (
            <div>
                <div>{job.position}</div>
                <div>Skills In Common</div>
                {
                    skillMatches.map(skill => (
                        <div>
                            <Icon name="checkmark" color="green"/>
                            <div>skill</div>
                        </div>
                    ))
                }
                <div>Skills Missing</div>
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