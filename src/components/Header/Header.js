import React, { Component } from 'react';
import './Header.css';
import { BrowserRouter as Router, Route, Link, withRouter, Switch } from "react-router-dom";

class Header extends Component {
  // constructor(props){
  // super(props);
  // this.state = {};
  // }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Navbar</span>
        </Link>
        <div className='navbar-text'>Navbar for signin, signup and index</div>
        <span className='d-flex'>
          <button onClick={this.home} className="btn btn-primary">Home</button>
          <Link className="nav-link" to="/signin">
            Sign in
            <span className="sr-only">(current)</span>
          </Link>
          <Link className="nav-link" to="/signup">
            Sign up
            <span className="sr-only">(current)</span>
          </Link>
        </span>
      </nav>
    );
  }

  home = () => {
    console.log('TODO');
  }
}

export default Header;