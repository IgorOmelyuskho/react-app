import React, { Component } from 'react';
import { Route, Link, withRouter, Redirect, Switch } from "react-router-dom";
import AuthService from '../../../services/AuthService';
import { TranslateService, translate } from '../../../services/TranslateService';
import './VendorHeader.scss';

class VendorHeader extends Component {
  self = 'VendorHeader';

  render() {
    const SignOutButton = () => (  /* 2 way */
      <Route render={({ history }) => (
        <button
          className="btn btn-primary"
          type='button'
          onClick={() => { AuthService.signOut() }}
        >
          {translate(this.self, 'signOut')}
        </button>
      )} />
    )

    return <nav className="VendorHeader navbar navbar-dark bg-dark">
      <Link to="/">
        <span className="navbar-brand mb-0 h1">IIUA</span>
      </Link>
      <div className='navbar-text'>VENDOR Navbar</div>
      <span className='d-flex'>
        <Link className="nav-link" to="/vendor/main">
          {translate(this.self, 'main')}
        </Link>
        <Link className="nav-link" to="/vendor/view-projects">
          {translate(this.self, 'allProjects')}
        </Link>
        <Link className="nav-link" to="/vendor/projects">
          {translate(this.self, 'myProjects')}
        </Link>
        <Link className="nav-link" to="/vendor/profile">
          {translate(this.self, 'profile')}
        </Link>
        <select defaultValue={TranslateService.lang === 'en' ? 'en' : 'ru'} className="language" onChange={this.setLanguage.bind(this)}>
          <option value="ru">Ru</option>
          <option value="en">En</option>
        </select>
        <SignOutButton />
      </span>
    </nav>
  }

  setLanguage = (event) => {
    TranslateService.setLanguage(event.target.value);
  }
}

export default VendorHeader;