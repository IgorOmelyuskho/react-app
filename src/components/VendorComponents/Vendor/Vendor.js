import React, { Component } from 'react';
import './Vendor.css';
import { BrowserRouter, Route, Link, withRouter, Switch, Redirect } from "react-router-dom";
import VendorMain from '../VendorMain/index';
import ViewProjects from '../ViewProjects/index';
import VendorProjects from '../VendorProjects/index';

class Vendor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="vendor">
        <Switch>
          <Route path="/vendor/view-projects" component={ViewProjects} />
          <Route path="/vendor/projects" component={VendorProjects} />
          <Route path="/vendor/main" component={VendorMain} />
          <Route component={VendorMain} />
        </Switch>
      </div>
    );
  }
}

export default Vendor;

