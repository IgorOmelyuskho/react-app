import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, withRouter, Switch } from "react-router-dom";
import EmailValidate from './components/EmailValidate/index';
import 'bootstrap/dist/css/bootstrap.css';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

import Header from './components/Header/index';
import Index from './components/Index/index';
import SignIn from './components/SignIn/index';
import SignUp from './components/SignUp//index';
import Home from './components/Home/index';


class App extends Component {
  render() {
    return (
      <div className="App">
        <ReactNotification />
        <Router>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Index} />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/home" component={Home} />
              <Route path="/email-validate/:code" component={EmailValidate} />
              {/* <Route component={NoMatch} /> redirect*/}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
