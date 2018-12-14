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
                    <Link to={'/'} className="navBarName">Regional Skill Analysis</Link>
                    <List horizontal className="navBarItems">
                        <List.Item>
                            <Link to={'/new-job'}>Post A Job</Link>
                        </List.Item>
                    </List>
                </div>
            </div>
        )
    }
}

export const NavBarLoggedIn = withRouter(NavBarLoggedInComponent)