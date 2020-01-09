import React, { Component } from 'react';
import './Investor.scss';
import { Route, Switch } from "react-router-dom";
import InvestorMain from '../InvestorMain/index';
import InvestorFindProjects from '../InvestorFindProjects/index';
import InvestorViewProject from '../InvestorViewProject';
import InvestorProfile from '../InvestorProfile/InvestorProfile';

class Investor extends Component {
  constructor(props) {
    super(props);
    this.state = {t: 1};
  }

  render() {
    return (
      <div className="Investor">
        <Switch>
          <Route path="/investor/find-projects" component={InvestorFindProjects} />
          <Route path="/investor/project/:id" component={InvestorViewProject} />
          <Route path="/investor/main" component={InvestorMain} />
          <Route path="/investor/profile" component={InvestorProfile} />
          <Route component={InvestorMain} />
        </Switch>
      </div>
    );
  }
}

export default Investor;

