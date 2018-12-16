import * as React from 'react';
import '../Styles/Footer.css';

export class Footer extends React.Component {
    render() {
        return (
            <div className="footerPositioningContainer">
                <div className="footerContainer">
                    <div>
                        Contact Us:
                        &nbsp;
                        <a href={`mailto:jeffrey.kerns@gmail.com`}>jeffrey.kerns@gmail.com</a>
                    </div>
                </div>
            </div>
        )
    }
}