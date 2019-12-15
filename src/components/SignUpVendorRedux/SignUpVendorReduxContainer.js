import React, { Component } from 'react';
import SignUpVendorRedux from './SignUpVendorRedux';
import { connect } from 'react-redux';
import { setData } from '../../store/SignUpVendorRedux/actions';

const mapStateToProps = state => {
  const st = state.signUpVendorRedux;
  return {
    showFullNameError: st.fullNameError !== '' && st.submitted,
    showEmailError: st.emailError !== '' && st.submitted,
    showPasswordError: st.passwordError !== '' && st.submitted,
    showRePasswordError: st.rePasswordError !== '' && st.submitted,
  
    fullNameError: st.fullNameError,
    emailError: st.emailError,
    passwordError: st.passwordError,
    rePasswordError: st.rePasswordError,
  
    fullName: st.fullName,
    email: st.email,
    password: st.password,
    rePassword: st.rePassword,
  
    formValid: st.formValid,
    submitted: st.submitted
  }
}

const mapDispatchToProps = {
  setData
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpVendorRedux);
