import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from './Frontend/Stores/index';
import { initialState } from './Frontend/Reducers/rootReducer';
import { Route, HashRouter } from 'react-router-dom';
import { NavBar } from './Frontend/Components/NavBar/NavBar';
import { LoginPage } from './Frontend/Components/LoginPage';
import { HomePage } from './Frontend/Components/HomePage';
import { JobForm } from './Frontend/Components/Employer/JobForm';
import { JobDrilldown } from './Frontend/Components/Job/JobDrilldown';
import { CourseForm } from './Frontend/Components/Employer/CourseForm';
import { Footer } from './Frontend/Components/Footer';
import './Frontend/Styles/GeneralStyling.css';

const store = configureStore(initialState);

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <>
            <NavBar/>
            <div className="bodyPositioningContainer">
              <Route exact={true} path="/" component={HomePage} />
              <Route path="/login" component={LoginPage}/>
              <Route path="/new-job" component={JobForm}/>
              <Route path="/job/:id" component={JobDrilldown}/>
              <Route path="/new-course" component={CourseForm}/>
            </div>
            <Footer/>
          </>
        </HashRouter>
      </Provider>
    )
  }
}

export default App;
