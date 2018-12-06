import * as React from 'react';
import '../Styles/loginContainer.css';
import { Form, Icon, InputOnChangeData } from 'semantic-ui-react';

interface State {
    showPassword: boolean;
    companyName: string;
    email: string;
    password: string;
}

export class LoginPage extends React.Component<{}, State> {

    state = {
        showPassword: false,
        companyName: '',
        email: '',
        password: ''
    }

    onCompanyNameChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ companyName: value });
    onEmailChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ email: value });
    onPasswordChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ password: value });

    flipPasswordVisibilityState = () => this.setState(({showPassword}) => ({showPassword: !showPassword}));

    render() {
        const { showPassword, companyName, email, password } = this.state;
        return (
            <div className="loginContainer">
                <div className="leftSide">
                    <div className="leftItem leftHeader">Large text</div>
                    <div className="leftItem">some more text explianing whats going on</div>
                    <div className="leftItem">some point</div>
                    <div className="leftItem">another point yeyyyyyyyyy</div>
                </div>
                <div className="rightSide">
                    <div className="rightHeader">Sign Up</div>
                    <Form>
                        <Form.Input 
                            value={companyName} 
                            label={"Company Name"}
                            onChange={this.onCompanyNameChange}
                            />
                        <Form.Input 
                            value={email}
                            label={"Email"} 
                            required
                            onChange={this.onEmailChange}
                            />
                        <Form.Input 
                            required
                            value={password}
                            onChange={this.onPasswordChange}
                            label={"Password"} 
                            type={showPassword ? "" : "password"} 
                            icon={showPassword ? 
                                <Icon name={"eye slash"} onClick={this.flipPasswordVisibilityState}/> 
                                : 
                                <Icon name={"eye"} onClick={this.flipPasswordVisibilityState}/>
                            } 
                        />
                        <Form.Button disabled={email.length === 0 || password.length === 0} content={"Sign Up"} />
                    </Form>
                </div>
            </div>
        )
    }
}