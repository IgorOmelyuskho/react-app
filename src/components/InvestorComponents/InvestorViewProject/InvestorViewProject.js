import React, { Component } from 'react';
import './InvestorViewProject';
import { Route, Switch } from "react-router-dom";
import InvestorViewProject from '.';

class InvestorMain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="InvestorMain">
        INVESTOR MAIN PAGE
      </div>
    );
  }
}

export default InvestorMain;

