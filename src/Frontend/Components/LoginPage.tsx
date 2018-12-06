import * as React from 'react';
import '../Styles/loginContainer.css';
import { Form, Icon } from 'semantic-ui-react';

interface State {
    showPassword: boolean;
}

export class LoginPage extends React.Component<{}, State> {

    state = {
        showPassword: false
    }

    render() {
        const { showPassword } = this.state;
        return (
            <div className="loginContainer">
                <div className="leftSide">
                    <div>Large text</div>
                    <div>some more text explianing whats going on</div>
                    <div>some point</div>
                    <div>another point yeyyyyyyyyy</div>
                </div>
                <div className="rightSide">
                    <div>Sign Up</div>
                    <Form>
                        <Form.Input label={"Company Name"}/>
                        <Form.Input label={"Email"} required/>
                        <Form.Input 
                            required
                            label={"Password"} 
                            type={showPassword ? "" : "password"} 
                            icon={showPassword ? 
                                <Icon name={"eye slash"} onClick={() => this.setState({showPassword: false})}/> 
                                : 
                                <Icon name={"eye"} onClick={() => this.setState({showPassword: true})}/>
                            } 
                        />
                        <Form.Button content={"Sign Up"} />
                    </Form>
                </div>
            </div>
        )
    }
}