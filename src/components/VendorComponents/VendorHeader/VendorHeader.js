import React, { Component } from 'react';
import { Route, Link, withRouter, Redirect, Switch } from "react-router-dom";

class VendorHeader extends Component {
  render() {
    return <nav className="navbar navbar-dark bg-dark">
      <Link to="/">
        <span className="navbar-brand mb-0 h1">IIUA</span>
      </Link>
      <div className='navbar-text'>VENDOR Navbar</div>
      <span className='d-flex'>
        <Link className="nav-link" to="/vendor/main">
          Main
        <span className="sr-only">(current)</span>
        </Link>
        <Link className="nav-link" to="/vendor/view-projects">
          All Projects
        <span className="sr-only">(current)</span>
        </Link>
        <Link className="nav-link" to="/vendor/projects">
          My Projects
        <span className="sr-only">(current)</span>
        </Link>
      </span>
    </nav>
  }
}

export default VendorHeader;