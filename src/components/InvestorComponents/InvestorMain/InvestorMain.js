import React, { Component } from 'react';
import './InvestorMain.scss';
import { Route, Switch } from "react-router-dom";

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

