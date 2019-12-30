import React, { Component } from 'react';
import './SignUp.scss';
import SignUpVendor from '../SignUpVendor/SignUpVendor';
import SignUpVendorRedux from '../SignUpVendorRedux/SignUpVendorRedux';
import SignUpVendorReduxContainer from '../SignUpVendorRedux/SignUpVendorReduxContainer';
import SignUpInvestor from '../SignUpInvestor/SignUpInvestor';
import AuthService from '../../services/AuthService';
import SocialButton from '../SocialBtn/index';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: 'Vendor'
    };
  }
  componentDidMount() { 
    AuthService.userRoleForRegister = this.state.userRole;
  }

  render() {
    let signUpComponent;
    if (this.state.userRole === "Vendor") {
      signUpComponent = <SignUpVendorReduxContainer />;
    }
    if (this.state.userRole === "Investor") {
      signUpComponent = <SignUpInvestor />;
    }

    return (
      <div className="SignUp">
        <div className="text-center">
          <button onClick={this.asVendor} className={"btn btn-primary select-role " + (this.state.userRole === "Vendor" ? 'selected' : '')}>Sign up as Vendor</button>
          <button /* disabled */ onClick={this.asInvestor} className={"btn btn-primary select-role " + (this.state.userRole === "Investor" ? 'selected' : '')}>Sign up as Investor</button>
        </div >

        {signUpComponent}

        <div className="social">
            <div className="text">Social Register</div>
            <div className="social-buttons">
              <SocialButton
                provider='google'
                appId='881274996713-i4d6ucdff7ljsga7vji3np737g1r63dn.apps.googleusercontent.com'
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
                <div className="social-signin-btn">
                  <img src="images/google.png" alt="" />
                </div>
              </SocialButton>
            </div>
          </div>

      </div >
    );
  }

  handleSocialLoginFailure = (err) => {
    console.log(err);
  }

  handleSocialLogin = (user) => {
    AuthService.signUpWithGoogle(user);
  }

  asVendor = () => {
    this.setState({ userRole: 'Vendor' });
    AuthService.userRoleForRegister = 'Vendor';
  }

  asInvestor = () => {
    this.setState({ userRole: 'Investor' });
    AuthService.userRoleForRegister = 'Investor';
  }
}

export default SignUp;