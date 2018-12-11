import * as React from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import '../../Styles/NavBar.css';
import { StoreState } from 'src/Frontend/Reducers/rootReducer';
import { connect } from 'react-redux';
import { NavBarLoggedIn } from './NavBarLoggedIn';

interface State {
    email: string;
    password: string;
}

interface StateProps {
    loggedIn: boolean;
}

class NavBarComponent extends React.Component<StateProps, State> {

    state = {
        email: '',
        password: ''
    }

    onEmailChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ email: value });
    onPasswordChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ password: value });

    render() {

        const {loggedIn} = this.props;
        const {email, password} = this.state;

        if (loggedIn) {
            return <NavBarLoggedIn/>
        } else {
            return (
                <div className="positioningContainer">
                    <div className="navBarContainer">
                        <div className="navBarName">Regional Skill Analysis</div>
                        <Form className="loginOptions">
                            <Form.Group>
                                <Form.Input value={email} label={"Email"} onChange={this.onEmailChange} />
                                <Form.Input
                                    value={password}
                                    label={"Password"}
                                    type={"password"}
                                    onChange={this.onPasswordChange}
                                />
                                <Form.Button content={"Log In"} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (store: StoreState): StateProps => {
    return { loggedIn: true }
}

export const NavBar = connect(mapStateToProps)(NavBarComponent);