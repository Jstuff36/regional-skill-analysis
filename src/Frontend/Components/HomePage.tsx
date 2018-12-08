import * as React from 'react';
import '../Styles/HomePage.css'
import { Input, InputOnChangeData, Divider } from 'semantic-ui-react';

interface State {
    zipCode: string;
}

class HomePageComponent extends React.Component<State> {

    state = {
        zipCode: ''
    }

    handleZipCodeChange = (_: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => this.setState({ zipCode: value });

    render() {

        const {zipCode} = this.state;

        return (
            <div className="homePageContainer">
                <div className="leftSide">
                    <div>Enter a Zip Code</div>
                    <Input 
                        className={"zipCodeInput"}
                        placeholder={"i.e. 11222"}
                        fluid
                        value={zipCode}
                        onChange={this.handleZipCodeChange}
                    />
                    <Divider/>
                    <div>Select Your Skills</div>
                </div>  
                <div className="rightSide">
                    <div>Jobs in your area</div>
                </div>
            </div>
        )
    }
}

export const HomePage = HomePageComponent;