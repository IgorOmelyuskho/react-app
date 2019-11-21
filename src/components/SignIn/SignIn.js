import React, { Component } from 'react';
import './SignIn.css';
import AuthService from '../../services/AuthService';
import * as NotificationService from '../../services/NotificationService';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      submitted: false
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
            <div>SignIn</div>
            <div className={this.validator.allValid() === true ? 'text-success' : 'text-danger'}>Form is valid: {this.validator.allValid().toString()}, does not work correctly</div>
            <form>
              <div className="mb-3 form-group">
                <div>Email</div>
                <input className="form-control" value={this.state.email} onChange={this.emailChange} type="email" name="email" />
                <div className="error">
                  {this.state.submitted ? (<div>
                    {this.validator.message('email', this.state.email, 'required|email')}
                  </div>) : null}
                </div>
              </div>

              <div className="mb-3 form-group">
                <div>Password</div>
                <input className="form-control" value={this.state.password} onChange={this.passwordChange} type="password" name="password" />
                <div className="error">
                  {this.state.submitted ? (<div>
                    { this.validator.message('password', this.state.password, 'required|min:6')}
                  </div>) : null}
                </div>
              </div>

              <button disabled={!this.validator.allValid() && this.state.submitted === true} className="btn btn-success" type="button" onClick={this.submitForm}>Sign in</button>

            </form>
          </div>
        </div>

        <div>{this.state.x}</div>
      </div>
    );
  }

  emailChange = (e) => {
    this.setState({
      email: e.target.value
    });
    this.validator.showMessages();
  }

  passwordChange = (e) => {
    this.setState({
      password: e.target.value
    });
    this.validator.showMessages();
  }

  submitForm = () => {
    this.setState({
      submitted: true
    })
    this.validator.showMessages();
    // if (this.validator.allValid() === false) { // this.validator.allValid() - not correctly ?
    //   alert(false)
    //   return;
    // }

    AuthService.signIn(this.state.email, this.state.password)
      .then((response) => {
        AuthService.successSocialOrEmailLogin(response.data.token);
      })
      .catch((error) => {
        NotificationService.notify(error.response.data.error.errorMessage[0]);
      });
  }
}

export default SignIn;

