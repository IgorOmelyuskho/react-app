import React, { Component } from 'react';
import './Vendor.scss';
import { Route, Switch } from "react-router-dom";
import VendorMain from '../VendorMain/index';
import ViewProjects from '../ViewProjects/index';
import VendorProjects from '../VendorProjects/index';
import VendorNewProject from '../VendorNewProject/index';
import UpdateVendorProject from '../UpdateVendorProject/index';

class Vendor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Vendor">
        <Switch>
          <Route path="/vendor/view-projects" component={ViewProjects} />
          <Route path="/vendor/projects" component={VendorProjects} />
          <Route path="/vendor/project/:id" component={UpdateVendorProject} />
          <Route path="/vendor/main" component={VendorMain} />
          <Route path="/vendor/new-project" component={VendorNewProject} />
          <Route component={VendorMain} />
        </Switch>
      </div>
    );
  }
}

export default Vendor;

