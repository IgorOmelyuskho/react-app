import React, { Component } from 'react';
import './SocialBtn.scss';
import SocialLogin from 'react-social-login'

class SocialBtn extends Component {

  render() {
    const { triggerLogin, ...rest } = this.props
    return (
      // <div onClick={this.props.triggerLogin} {...this.props}>
      //   {this.props.children}
      // </div>
      <div onClick={this.props.triggerLogin} {...rest}>
        {this.props.children}
      </div>
    );
  }
}

export default SocialLogin(SocialBtn);


