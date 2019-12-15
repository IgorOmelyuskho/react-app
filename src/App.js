import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter, Route, Link, withRouter, Switch } from "react-router-dom";
import EmailValidate from './components/EmailValidate/index';
import 'bootstrap/dist/css/bootstrap.css';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

import Header from './components/Header/index';
import Index from './components/Index/index';
import SignIn from './components/SignIn/index';
import SignUp from './components/SignUp//index';
import Vendor from './components/VendorComponents/Vendor/index';
import ForProgramRouting from './services/ForProgramRouting/ForProgramRouting';
import SharedHeader from './components/SharedHeader/index';

import AuthService from './services/AuthService';
import { useInterceptor } from './services/AddTokenInterceptor';
import { TranslateService } from './services/TranslateService';

import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../src/store/reducers';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

export const store = createStore(rootReducer, applyMiddleware(thunk));

class App extends Component {
  constructor(props) {
    super(props);
    useInterceptor();
    AuthService.init();
    TranslateService.changeLanguageEvent$.subscribe(
      val => { this.forceUpdate() }
    );
    store.subscribe(
      val => { console.log(store.getState()) }
    )
  }

  render() {
    const TestRouter = () => (
      <h1>TestRouter</h1>
    )

    const TestRouter_2 = () => (
      <h1>TestRouter_2</h1>
    )

    return (
      <Provider store={store}>
        <div className="App">
          <ReactNotification />
          <BrowserRouter>
            <div>
              <ForProgramRouting />
              <SharedHeader />
              <Switch>
                <Route exact path="/" component={Index} />
                {/* <Route path="/signin" component={SignIn} /> */}
                <Route path="/signin" render={matchProps => <SignIn {...matchProps} />} />
                <Route path="/signup" component={SignUp} />
                <Route path="/test_router" component={TestRouter} />
                <Route path="/test_router_2" component={TestRouter_2} />
                <Route path="/signup" component={SignUp} />
                <Route path="/email-validate/:code" component={EmailValidate} />
                <Route path="/vendor" render={() => <Vendor store={this.props.store} />} />
                <Route component={Index} /> {/* redirect */}
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
