import React, { Component } from 'react';
import './SignIn.scss';
import AuthService from '../../services/AuthService';
import * as NotificationService from '../../services/NotificationService';
import { translate } from '../../services/TranslateService';
import SocialButton from '../SocialBtn/index';

class SignIn extends Component {
  self = 'SignIn';
  nodes = {};

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
      <div className="SignIn">
        <div className="container">

          <div className="row">
            <div className="col-6 offset-3">
              {translate(this.self, 'signIn')}
              <div className={this.validator.allValid() === true ? 'text-success' : 'text-danger'}>Form is
                valid: {this.validator.allValid().toString()}, does not work correctly
              </div>
              <form>
                <div className="mb-3 form-group">
                  {translate(this.self, 'email')}
                  <input placeholder={translate(this.self, 'emailPlaceholder')} className="form-control"
                    value={this.state.email} onChange={this.emailChange} type="email" name="email" />
                  <div className="error">
                    {this.state.submitted ? (<div>
                      {this.validator.message('email', this.state.email, 'required|email')}
                    </div>) : null}
                  </div>
                </div>

                <div className="mb-3 form-group">
                  {translate(this.self, 'password')}
                  <input placeholder={translate(this.self, 'passwordPlaceholder')} className="form-control"
                    value={this.state.password} onChange={this.passwordChange} type="password" name="password" />
                  <div className="error">
                    {this.state.submitted ? (<div>
                      {this.validator.message('password', this.state.password, 'required|min:6')}
                    </div>) : null}
                  </div>
                </div>

                <button disabled={!this.validator.allValid() && this.state.submitted === true}
                  className="btn btn-success" type="button"
                  onClick={this.submitForm}>{translate(this.self, 'signInBtn')}</button>
              </form>
            </div>
          </div>

          <div className="social">
            <div className="text">Social LogIn</div>
            <div className="social-buttons">
              <SocialButton
                provider='google'
                appId='881274996713-i4d6ucdff7ljsga7vji3np737g1r63dn.apps.googleusercontent.com'
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
                // getInstance={this.setNodeRef.bind(this, 'google')}
              >
                <div className="social-signin-btn">
                  <img src="images/google.png" alt="" />
                </div>
              </SocialButton>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // logout() {
  //   const { currentProvider } = this.state
  //   console.log(currentProvider);

  //   if (currentProvider) {
  //     this.nodes[currentProvider].props.triggerLogout()
  //   }
  // }

  // setNodeRef(provider, node) {
  //   console.log(node);
  //   console.log(provider);
  //   if (node) {
  //     this.nodes[provider] = node
  //   }
  // }

  handleSocialLogin = (user) => {
    AuthService.signInWithGoogle(user);
  }

  handleSocialLoginFailure = (err) => {
    console.error(err)
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

