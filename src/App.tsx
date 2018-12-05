import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from './Frontend/Stores/index';
import { initialState } from './Frontend/Reducers/rootReducer';
import { Route, HashRouter } from 'react-router-dom';
import { NavBar } from './Frontend/Components/NavBar/NavBar';
import { LoginPage } from './Frontend/Components/LoginPage';
import { HomePage } from './Frontend/Components/HomePage';

const store = configureStore(initialState);

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <>
            <NavBar/>
            <Route path="/login" component={LoginPage}/>
            <Route exact={true} path="/" component={HomePage}/>
          </>
        </HashRouter>
      </Provider>
    )
  }
}

export default App;
