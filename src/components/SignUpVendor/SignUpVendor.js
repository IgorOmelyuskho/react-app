import React, { Component } from 'react';
import './SignUpVendor.css';
import MaskedInput from 'react-text-mask'
import AuthService from '../../services/AuthService';
import * as NotificationService from '../../services/NotificationService';

const phoneMask = ['+', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
const phonePattern = '\\+\\d{3}\\s\\d{2}\\s\\d{3}\\s\\d{4}';
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SignUpVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValid: false,
      submitted: false,
      fullName: "",
      fullNameError: 'fullName is required',
      // itn: "",
      // itnError: 'ITN is required',
      // phone: "",
      // phoneError: 'Phone is required',
      email: "",
      emailError: 'Email is required',
      password: "",
      passwordError: 'Password is required',
      rePassword: "",
      rePasswordError: 'Repeat password is required',
    };
  }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    const fullName = this.state.fullNameError !== '' && this.state.submitted;
    // const itn = this.state.itnError !== '' && this.state.submitted;
    // const phone = this.state.phoneError !== '' && this.state.submitted;
    const email = this.state.emailError !== '' && this.state.submitted;
    const password = this.state.passwordError !== '' && this.state.submitted;
    const rePassword = this.state.rePasswordError !== '' && this.state.submitted;

    return (
      <div className="container">

        <div className="row">
          <div className="col-6 offset-3">
            <div className="role">SignUp as Vendor</div>
            <div className={this.state.formValid === true ? 'text-success' : 'text-danger'}>Form is valid: {this.state.formValid.toString()}</div>
            <form>
              <div className="mb-3 form-group">
                <div>FullName</div>
                <input className={'form-control ' + (fullName ? 'is-invalid' : '')} value={this.state.fullName} onChange={this.handleUserInput} type="text" name="fullName" />
                {fullName && <div className="invalid-feedback">{this.state.fullNameError}</div>}
              </div>

              {/* <div className="mb-3 form-group">   
                <div>ITN</div>
                <input className={'form-control ' + (itn ? 'is-invalid' : '')} value={this.state.itn} onChange={this.handleUserInput} type="text" name="itn" />
                {itn && <div className="invalid-feedback">{this.state.itnError}</div>}
              </div> */}

              {/*    <div className="mb-3 form-group">
                <div>Phone</div>
                <MaskedInput className={'form-control ' + (phone ? 'is-invalid' : '')} mask={phoneMask} value={this.state.phone} onChange={this.handleUserInput} type="text" name="phone" />
                {phone && <div className="invalid-feedback">{this.state.phoneError}</div>}
              </div> */}

              <div className="mb-3 form-group">
                <div>Email</div>
                <input className={'form-control ' + (email ? 'is-invalid' : '')} value={this.state.email} onChange={this.handleUserInput} type="email" name="email" />
                {email && <div className="invalid-feedback">{this.state.emailError}</div>}
              </div>

              <div className="mb-3 form-group">
                <div>Password</div>
                <input className={'form-control ' + (password ? 'is-invalid' : '')} value={this.state.password} onChange={this.handleUserInput} type="password" name="password" />
                {password && <div className="invalid-feedback">{this.state.passwordError}</div>}
              </div>

              <div className="mb-3 form-group">
                <div>Repeat password</div>
                <input className={'form-control ' + (rePassword ? 'is-invalid' : '')} value={this.state.rePassword} onChange={this.handleUserInput} type="password" name="rePassword" />
                {rePassword && <div className="invalid-feedback">{this.state.rePasswordError}</div>}
              </div>

              <button className="btn btn-success" type="button" onClick={this.signUp}>Sign up</button>

            </form>
          </div>
        </div>
      </div>
    );
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let formValid = false;
    let fullNameError = this.state.fullNameError;
    // let itnError = this.state.itnError;
    // let phoneError = this.state.phoneError;
    let emailError = this.state.emailError;
    let passwordError = this.state.passwordError;
    let rePasswordError = this.state.rePasswordError;

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
      // case 'itn':
      //   if (value === "") {
      //     itnError = 'ITN is required';
      //   } else {
      //     itnError = '';
      //   }
      //   break;
      // case 'phone':
      //   if (value === "") {
      //     phoneError = 'Phone is required';
      //   } else if (!value.match(phonePattern)) {
      //     phoneError = 'Not valid phone';
      //   } else {
      //     phoneError = '';
      //   }
      //   break;
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
        if (value !== this.state.rePassword) {
          rePasswordError = 'Passwords not match';
        } else {
          rePasswordError = '';
        }
        break;
      case 'rePassword':
        if (value === "") {
          rePasswordError = 'Repeat password is required';
        } else if (value !== this.state.password) {
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
      // itnError.length === 0 &&
      // phoneError.length === 0 &&
      emailError.length === 0 &&
      passwordError.length === 0 &&
      rePasswordError.length === 0
    ) {
      formValid = true;
    }

    this.setState({
      formValid: formValid,
      fullNameError: fullNameError,
      // itnError: itnError,
      // phoneError: phoneError,
      emailError: emailError,
      passwordError: passwordError,
      rePasswordError: rePasswordError,
    }, () => { // because setState async
      // console.log(this.state.formValid);
    });
  }

  signUp = () => {
    this.setState({ submitted: true });

    if (this.state.formValid === false) {
      return;
    }

    AuthService.signUpAsVendor(this.state)
      .then((response) => {
        if (response.data == null || response.data.token == null) {
          NotificationService.notify('Check you email');
        }
      }
      )
      .catch((error) => {
        NotificationService.notify(error.response.data.error.errorMessage[0]);
      });
  }

}

export default SignUpVendor;