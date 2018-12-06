import * as React from 'react';
import { Form } from 'semantic-ui-react';
import '../../Styles/NavBar.css';

export class NavBar extends React.Component {
    render() {
        return (
            <div className="positioningContainer">
                <div className="navBarContainer">
                    <div className="navBarName">Regional Skill Analysis</div>
                    <Form className="loginOptions">
                        <Form.Group>
                            <Form.Input label={"Email"} />
                            <Form.Input label={"Password"}/>                    
                            <Form.Button content={"Log In"}/>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        )
    }
}