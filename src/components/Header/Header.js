import React, { Component } from 'react';
import './Header.css';
import { Route, Link, withRouter, Redirect, Switch } from "react-router-dom";
import my_history_2 from '../../services/HistoryModule';
import AuthService from '../../services/AuthService';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };

    // setTimeout(() => {
    //   console.log(my_history_2);
    //   console.log(props.history);
    //   my_history_2.push('vendor/main')
    // }, 1000)
  }

  render() {
    const HomeButton = withRouter(({ history }) => (  /* 1 way */
      <button
        className="btn btn-primary"
        type='button'
        onClick={() => { history.push('/vendor') }}
      >
        Home
      </button>
    ));

    const SignOutButton = () => (  /* 2 way */
      <Route render={({ history }) => (
        <button
          className="btn btn-primary"
          type='button'
          onClick={() => { AuthService.signOut() }}
        >
          SignOut
        </button>
      )} />
    )

    /* 3 way - use context */
    /* 5 way - see bottom (change url, but not render) */
    /* 6 way - see bottom (change url, but not render) */
    /* 7 way - work only first time */

    return (
      <nav className="navbar navbar-dark bg-dark">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">IIUA</span>
        </Link>
        <div className='navbar-text'>Navbar for signin, signup and index</div>
        <span className='d-flex'>
          <HomeButton />
          <SignOutButton />
          <button onClick={() => { this.props.history.push('/test_router') }}>click</button>  {/* 5 way */}
          <button onClick={() => { my_history_2.push('/test_router_2') }}>click_2</button>  {/* 6 way */}
          {this.renderRedirect()}
          <button onClick={this.setRedirect}>Home</button>  {/* 7 way */}
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

  setRedirect = () => {  /* for 7 way */
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => { /* for 7 way */
    if (this.state.redirect) {
      return <Redirect to='/vendor' />
    }
  }
}

export default Header;