import React, { Component } from 'react';
import './SignUp.css';
import SignUpVendor from '../SignUpVendor/SignUpVendor';
import SignUpVendorRedux from '../SignUpVendorRedux/SignUpVendorRedux';
import SignUpVendorReduxContainer from '../SignUpVendorRedux/SignUpVendorReduxContainer';
import SignUpInvestor from '../SignUpInvestor/SignUpInvestor';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: 'Vendor'
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
    let signUpComponent;
    if (this.state.userRole === "Vendor") {
      signUpComponent = <SignUpVendorReduxContainer />;
    }
    if (this.state.userRole === "Investor") {
      signUpComponent = <SignUpInvestor />;
    }

    return (
      <div>
        <div className="text-center">
          <button onClick={this.asVendor} className="btn btn-primary select-role">Sign up as Vendor</button>
          <button /* disabled */ onClick={this.asInvestor} className="btn btn-primary select-role">Sign up as Investor</button>
        </div >

        {signUpComponent}

      </div >
    );
  }

  asVendor = () => {
    this.setState({userRole: 'Vendor'})
  }

  asInvestor = () => {
    this.setState({userRole: 'Investor'})
  }
}

export default SignUp;