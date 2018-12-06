import * as React from 'react';
import { Input, Button } from 'semantic-ui-react';
import '../../Styles/NavBar.css';

export class NavBar extends React.Component {
    render() {
        return (
            <div className="navBarContainer">
                <span>Regional Skill Analysis</span>
                <Input label={"Email"}/>
                <Input label={"Password"}/>
                <Button content={"Log In"}/>
            </div>
        )
    }
}