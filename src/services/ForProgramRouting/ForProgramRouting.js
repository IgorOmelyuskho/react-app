import React, { Component } from 'react';
import './ForProgramRouting.css';
import { Route } from "react-router-dom";

import Navigate from './Navigate';

export default class ForProgramRouting extends Component {
  render() {
    const Button = () => (
      <Route render={({ history }) => (
        <button
          id="id_for_program_routing"
          type='button'
          onClick={() => { history.push(Navigate.url_for_navigate); /* console.log("CLICK ", Navigate.url_for_navigate) */ }}
        >
          CLICK
        </button>
      )} />
    )

    return (
      <div className="fixed">
        {/* <Link id="id_for_program_routing" to="/vendor">for_program_routing</Link> */}
        <Button></Button>

        <button onClick={this.btnClick.bind(this, '/vendor')}>vendor</button>
        <button onClick={this.btnClick.bind(this, '/vendor/main')}>vendor/main</button>
        <button onClick={this.btnClick.bind(this, '/vendor/view-projects')}>vendor/view-projects</button>
        <button onClick={this.btnClick.bind(this, '/')}>/</button>
        <button onClick={this.btnClick.bind(this, '/signin')}>signin</button>
        <button onClick={this.btnClick.bind(this, '/signup')}>signup</button>
      </div>
    );
  }

  btnClick = (url, event) => {
    // console.log(event.target);
    // console.log(url);
    Navigate.navigateByUrl(url);
  }
}


