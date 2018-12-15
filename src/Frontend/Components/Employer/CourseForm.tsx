import * as React from 'react';
import { connect } from 'react-redux';

class CourseFormComponent extends React.Component {

    renderCourseForm = () => {
    }

    renderCoursePostings = () => {
    }

    render() {
        return (
            <div className="courseFormContainer">
                <div className="leftSide">
                    <div className="header">Create A Course Posting</div>
                    {this.renderCourseForm()}
                </div>
                <div className="rightSide">
                    <div className="header">Current Course Postings</div>
                    {this.renderCoursePostings()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => {

}

export const CourseForm = CourseFormComponent

