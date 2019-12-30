import React, { Component } from 'react';
import './VendorProfile.scss';
import AuthService from '../../../services/AuthService';
import { removeVendorProfile } from '../../../services/ProfileService';

class VendorProfile extends Component {
  self = 'VendorProfile';
  subscribe;

  constructor(props) {
    super(props);
    this.state = {
      vendorProfile: null
    }
  }

  componentDidMount() {
    this.subscribe = AuthService.user$.subscribe(
      vendor => {
        if (vendor == null) {
          return;
        }
        this.setState({ vendorProfile: vendor })
      },
      err => {
        console.warn(err);
        AuthService.signOut();
      }
    );
  }

  componentWillUnmount() {
    this.subscribe.unsubscribe();
  }

  render() {
    return <div className="VendorProfile">
      {this.state.vendorProfile && <div>
        <div>Full name: {this.state.vendorProfile.fullName}</div>
        <div>Email: {this.state.vendorProfile.email}</div>
        <div>IsSocial: {this.state.vendorProfile.isSocial.toString()}</div>
        <div>UserRole: {this.state.vendorProfile.userRole}</div>
      </div>}

      <button className="btn btn-danger" onClick={this.removeAccount}>Remove account</button>
    </div>
  }

  removeAccount = () => {
    removeVendorProfile()
      .then(
        () => {
          AuthService.signOut();
        },
        err => {
          console.warn(err);
        }
      )
  }
}

export default VendorProfile;