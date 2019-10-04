import React, { Component } from 'react';
import './SignUpInvestor.css';
import MaskedInput from 'react-text-mask'
import * as AuthService from '../../services/AuthService';

const phoneMask = ['+', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
const phonePattern = '\\\+\\d\{3\}\\s\\d\{2\}\\s\\d\{3\}\\s\\d\{4\}';
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SignUpInvestor extends Component {
  constructor(props) {
    console.log();
    super(props);
    this.state = {
      fullName: "",
      // phone: "",
      // creditCardNumber: "",
      email: "",
      password: "",
      rePassword: "",
    };
    this.validator = new window.SimpleReactValidator();
  }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <div className="container">

        <div className="row">
          <div className="col-6 offset-3">
            <div>SignUpInvestor</div>
            <div className={this.validator.allValid() === true ? 'text-success' : 'text-danger'}>Form is valid: {this.validator.allValid().toString()}, does not work correctly</div>
            <form>
              <div className="mb-3 form-group">
                <div>FullName</div>
                <input className="form-control" value={this.state.fullName} onChange={this.handleUserInput} type="text" name="fullName" />
                {this.validator.message('fullName', this.state.fullName, 'required')}
              </div>

              {/* <div className="mb-3 form-group">
                <div>CreditCardNumber</div>
                <input className="form-control" value={this.state.creditCardNumber} onChange={this.handleUserInput} type="text" name="creditCardNumber" />
                {this.validator.message('creditCardNumber', this.state.creditCardNumber, 'required')}
              </div> */}

              {/* <div className="mb-3 form-group">
                <div>Phone</div> 
                <MaskedInput className="form-control" mask={phoneMask} value={this.state.phone} onChange={this.handleUserInput} type="text" name="phone" />
                {this.validator.message('phone', this.state.phone, 'required|regex:' + phonePattern)}
              </div> */}

              <div className="mb-3 form-group">
                <div>Email</div>
                <input className="form-control" value={this.state.email} onChange={this.handleUserInput} type="email" name="email" />
              </div>

              <div className="mb-3 form-group">
                <div>Password</div>
                <input className="form-control" value={this.state.password} onChange={this.handleUserInput} type="password" name="password" />
              </div>

              <div className="mb-3 form-group">
                <div>Repeat password</div>
                <input className="form-control" value={this.state.rePassword} onChange={this.handleUserInput} type="password" name="rePassword" />
              </div>

              <button className="btn btn-success" type="button" onClick={this.signUp}>Sign up</button>

            </form>
          </div>
        </div>

        <div>{this.state.x}</div>
      </div>

    );
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const formValid = this.validator.allValid();
    this.setState({ [name]: value, formValid }, () => {
      // this.forceUpdate(); 
    });
  }

  signUp = () => {
    console.log(this.validator.allValid());
    if (this.validator.allValid()) {
      AuthService.signUpAsInvestor(this.state);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
}

export default SignUpInvestor;