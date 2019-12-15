import React, { Component } from 'react';
import './SignUpVendorRedux.css';
import AuthService from '../../services/AuthService';
import * as NotificationService from '../../services/NotificationService';
import { store } from '../../App';

const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SignUpVendorRedux extends Component {
  render() {
    const showFullNameError = this.props.showFullNameError;
    const showEmailError = this.props.showEmailError;
    const showPasswordError  = this.props.showPasswordError;
    const showRePasswordError  = this.props.showRePasswordError;

    const fullNameError = this.props.fullNameError;
    const emailError = this.props.emailError;
    const passwordError = this.props.passwordError;
    const rePasswordError = this.props.rePasswordError;

    const fullName = this.props.fullName;
    const email = this.props.email;
    const password = this.props.password;
    const rePassword = this.props.rePassword;

    const formValid = this.props.formValid;
    const submitted = this.props.submitted;

    return (
      <div className="container">

        <div className="row">
          <div className="col-6 offset-3">
            <div className="role">SignUp as Vendor</div>
            <div className={formValid === true ? 'text-success' : 'text-danger'}>Form is valid: {formValid.toString()}</div>
            <form>
              <div className="mb-3 form-group">
                <div>FullName</div>
                <input className={'form-control ' + (showFullNameError ? 'is-invalid' : '')} value={fullName} onChange={this.handleUserInput} type="text" name="fullName" />
                {showFullNameError && <div className="invalid-feedback">{fullNameError}</div>}
              </div>

              <div className="mb-3 form-group">
                <div>Email</div>
                <input className={'form-control ' + (showEmailError ? 'is-invalid' : '')} value={email} onChange={this.handleUserInput} type="email" name="email" />
                {showEmailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              <div className="mb-3 form-group">
                <div>Password</div>
                <input className={'form-control ' + (showPasswordError ? 'is-invalid' : '')} value={password} onChange={this.handleUserInput} type="password" name="password" />
                {showPasswordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>

              <div className="mb-3 form-group">
                <div>Repeat password</div>
                <input className={'form-control ' + (showRePasswordError ? 'is-invalid' : '')} value={rePassword} onChange={this.handleUserInput} type="password" name="rePassword" />
                {showRePasswordError && <div className="invalid-feedback">{rePasswordError}</div>}
              </div>

              <button disabled={formValid === false && submitted === true} className="btn btn-success" type="button" onClick={this.signUp}>Sign up</button>

            </form>
          </div>
        </div>
      </div>
    );
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.props.setData({ [name]: value }); 
    this.validateField(name, value)
  }

  validateField(fieldName, value) {
    let formValid = false;
    let fullNameError = this.props.fullNameError;
    let emailError = this.props.emailError;
    let passwordError = this.props.passwordError;
    let rePasswordError = this.props.rePasswordError;
    let password = this.props.password;
    let rePassword = this.props.rePassword;

    switch (fieldName) {
      case 'fullName':
        if (value === "") {
          fullNameError = 'fullName is required';
        } else if (value.length <= 3) {
          fullNameError = 'fullName length must be > 3';
        } else {
          fullNameError = '';
        }
        break;
      case 'email':
        if (value === "") {
          emailError = 'Email is required';
        } else if (!value.match(emailPattern)) {
          emailError = 'Not valid email';
        } else {
          emailError = '';
        }
        break;
      case 'password':
        if (value === "") {
          passwordError = 'Password is required';
        } else if (value.length < 6) {
          passwordError = 'Min length is 6';
        } else {
          passwordError = '';
        }
        if (value !== rePassword) {
          rePasswordError = 'Passwords not match';
        } else {
          rePasswordError = '';
        }
        break;
      case 'rePassword':
        if (value === "") {
          rePasswordError = 'Repeat password is required';
        } else if (value !== password) {
          rePasswordError = 'Passwords not match';
        } else {
          rePasswordError = '';
        }
        break;
      default:
        break;
    }

    if (
      fullNameError.length === 0 &&
      emailError.length === 0 &&
      passwordError.length === 0 &&
      rePasswordError.length === 0
    ) {
      formValid = true;
    }

    this.props.setData({
      formValid: formValid,
      fullNameError: fullNameError,
      emailError: emailError,
      passwordError: passwordError,
      rePasswordError: rePasswordError,
    });
  }

  signUp = () => {
    this.props.setData({ submitted: true });

    if (this.props.formValid === false) {
      return;
    }

    AuthService.signUpAsVendor(store.getState().signUpVendorRedux)
      .then((response) => {
        if (response.data == null || response.data.token == null) {
          NotificationService.notify('Check you email');
        }
      })
      .catch((error) => {
        NotificationService.notify(error.response.data.error.errorMessage[0]);
      });
  }

}

export default SignUpVendorRedux;