import * as React from 'react';
import { Job } from 'src/Frontend/Reducers/jobsReducer';
import { RouteComponentProps, withRouter } from 'react-router';


interface OwnProps {
    job: Job
}



type Props = OwnProps & RouteComponentProps<{id: string}>

class JobDrilldownComponent extends React.Component<Props> {
    render() {
        return (
            <div>
                id: {this.props.match.params.id}
            </div>
        )
    }
}

export const JobDrilldown = withRouter(JobDrilldownComponent)