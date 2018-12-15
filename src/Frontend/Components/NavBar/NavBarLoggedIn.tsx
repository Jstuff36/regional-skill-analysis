import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import '../../Styles/NavBarLoggedIn.css';
import { List } from 'semantic-ui-react';

type OwnProps = RouteComponentProps<{}>
type Props = OwnProps;

class NavBarLoggedInComponent extends React.Component<Props> {
    render() {
        return (
            <div className="positioningContainer">
                <div className="navBarLoggedInContainer">
                    <Link to={'/'} className="navBarName link">Regional Skill Analysis</Link>
                    <List horizontal divided className="navBarItem">
                        <List.Item>
                            <Link className="link" to={'/new-job'}>Post A Job</Link>
                        </List.Item>
                        <List.Item>
                            <Link className="link" to={'/new-course'}>Post A Course</Link>
                        </List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

export const NavBarLoggedIn = withRouter(NavBarLoggedInComponent)