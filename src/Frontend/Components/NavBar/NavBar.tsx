import * as React from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import '../../Styles/NavBar.css';

interface State {
    email: string;
    password: string;
}

export class NavBar extends React.Component<{}, State> {

    state = {
        email: '',
        password: ''
    }

    onEmailChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ email: value });
    onPasswordChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ password: value });

    render() {

        const {email, password} = this.state;

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
                            <Form.Button content={"Log In"}/>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        )
    }
}