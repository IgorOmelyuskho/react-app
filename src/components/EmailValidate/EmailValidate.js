import React, { Component } from 'react';
import './EmailValidate.css';
import * as AuthService from '../../services/AuthService';

class EmailValidate extends Component {
  constructor(props) {
    super(props);
    const path = window.location.pathname;
    const pathArr = path.split('/');
    this.state = {
      code: pathArr[pathArr.length - 1],
      failedConfirmEmail: false
    }
    this.confirmEmail();
  }

  render() {
    return (
      <div className="container">
        <div>EMAIL VALIDATE CODE: {this.state.code}</div>
        {this.state.failedConfirmEmail &&
          <div className="failed-confirm-email">Failed confirm email</div>
        }
      </div>
    );
  }

  confirmEmail() {
    const urlArr = window.location.href.split('/');
    this.code = urlArr[urlArr.length - 1];
    AuthService.emailValidate(this.code)
      .then((response) => {
        console.log(response);
        if (response.mailIsVerified === true && response.token) {
          AuthService.successSocialOrEmailLogin(response.token);
        } else {
          this.setState({ failedConfirmEmail: true });
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }
}

export default EmailValidate;