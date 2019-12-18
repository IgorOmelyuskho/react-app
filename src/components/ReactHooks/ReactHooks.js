import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import './ReactHooks.scss';
import { ThemeContext } from '../../App';
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function ReactHooks(props) {
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('FullName is required');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('Email is required');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('Password is required');
  const [rePassword, setRePassword] = useState('');
  const [rePasswordError, setRePasswordError] = useState('Repeat password is required');
  const [formValid, setFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'rePassword':
        setRePassword(value);
        break;
      default: break;
    }

    validateField(name, value)
  }

  const validateField = (fieldName, value) => {
    let formValidLocal = false;
    let fullNameErrorLocal = fullNameError;
    let emailErrorLocal = emailError;
    let passwordErrorLocal = passwordError;
    let rePasswordErrorLocal = rePasswordError;

    switch (fieldName) {
      case 'fullName':
        if (value === "") {
          fullNameErrorLocal = 'fullName is required';
        } else if (value.length <= 3) {
          fullNameErrorLocal = 'fullName length must be > 3';
        } else {
          fullNameErrorLocal = '';
        }
        break;
      case 'email':
        if (value === "") {
          emailErrorLocal = 'Email is required';
        } else if (!value.match(emailPattern)) {
          emailErrorLocal = 'Not valid email';
        } else {
          emailErrorLocal = '';
        }
        break;
      case 'password':
        if (value === "") {
          passwordErrorLocal = 'Password is required';
        } else if (value.length < 6) {
          passwordErrorLocal = 'Min length is 6';
        } else {
          passwordErrorLocal = '';
        }
        if (value !== rePassword) {
          rePasswordErrorLocal = 'Passwords not match';
        } else {
          rePasswordErrorLocal = '';
        }
        break;
      case 'rePassword':
        if (value === "") {
          rePasswordErrorLocal = 'Repeat password is required';
        } else if (value !== password) {
          rePasswordErrorLocal = 'Passwords not match';
        } else {
          rePasswordErrorLocal = '';
        }
        break;
      default:
        break;
    }

    if (
      fullNameErrorLocal.length === 0 &&
      emailErrorLocal.length === 0 &&
      passwordErrorLocal.length === 0 &&
      rePasswordErrorLocal.length === 0
    ) {
      formValidLocal = true;
    }

    setFormValid(formValidLocal);
    setFullNameError(fullNameErrorLocal);
    setEmailError(emailErrorLocal);
    setPasswordError(passwordErrorLocal);
    setRePasswordError(rePasswordErrorLocal);
  }

  const signUp = () => {
    setSubmitted(true);
    if (formValid === false) {
      return;
    }
    alert('SIGNUP SUSSES')
  }

  const errorFullName = fullNameError !== '' && submitted;
  const errorEmail = emailError !== '' && submitted;
  const errorPassword = passwordError !== '' && submitted;
  const errorRePassword = rePasswordError !== '' && submitted;

  // useEffect(() => console.log('ASYNC HOOK MOUNTED - NOT EQUIVALENT COMPONENT_DID_MOUNT'), []);
  // useEffect(() => console.log('ASYNC MOUNTED OR UPDATED'));
  // useEffect(() => {
  //   return () => {
  //     console.log('ASYNC WILL UNMOUNT');
  //   }
  // }, []);


  //ASYNC MOUNTED AND UNMOUNT - UPDATED CAN USE IN RENDER FUNCTION
  // useEffect(() => {
  //   console.log('ASYNC HOOK MOUNTED - NOT EQUIVALENT COMPONENT_DID_MOUNT');
  //   // returned function will be called on component unmount 
  //   return () => {
  //     console.log('ASYNC WILL UNMOUNT');
  //   }
  // }, [])
  // console.log('ASYNC UPDATED');


  // useEffect(() => {
  //   console.log('ASYNC HOOK AFTER EACH RENDER'); // or use in render function
  // });

  // useEffect(() => {
  //   console.log('ASYNC HOOK MOUNTED - NOT EQUIVALENT COMPONENT_DID_MOUNT');
  // }, []);

  // useEffect(() => {
  //   function handleStatusChange(status) {
  //     console.log("STATUS ", status);
  //   }
  //   console.log('ASYNC HOOK AFTER EACH RENDER');
  //   handleStatusChange(true);
  //   return function cleanup() {
  //     console.log('ASYNC HOOK !!!!!!');
  //     handleStatusChange(false);
  //   };
  // });



  // const theme = useContext(ThemeContext);
  // console.log(theme);

  
  useLayoutEffect(() => console.log('SYNC HOOK MOUNTED - NOT EQUIVALENT COMPONENT_DID_MOUNT'), []);
  useLayoutEffect(() => console.log('SYNC MOUNTED OR UPDATED'));
  useLayoutEffect(() => {
    return () => {
      console.log('SYNC WILL UNMOUNT');
    }
  }, []);

  return <div className="ReactHooks">
    <div className="container">
      <div>ReactHooks</div>
      <div className={formValid === true ? 'text-success' : 'text-danger'}>Form is valid: {formValid.toString()}</div>
      <div className="row">
        <div className="col-6 offset-3">
          <div className="mb-3 form-group">
            <div>FullName</div>
            <input className={'form-control ' + (errorFullName ? 'is-invalid' : '')} value={fullName} onChange={handleUserInput} type="text" name="fullName" />
            {fullName && <div className="invalid-feedback">{fullNameError}</div>}
          </div>

          <div className="mb-3 form-group">
            <div>Email</div>
            <input className={'form-control ' + (errorEmail ? 'is-invalid' : '')} value={email} onChange={handleUserInput} type="email" name="email" />
            {email && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="mb-3 form-group">
            <div>Password</div>
            <input className={'form-control ' + (errorPassword ? 'is-invalid' : '')} value={password} onChange={handleUserInput} type="password" name="password" />
            {password && <div className="invalid-feedback">{passwordError}</div>}
          </div>

          <div className="mb-3 form-group">
            <div>Repeat password</div>
            <input className={'form-control ' + (errorRePassword ? 'is-invalid' : '')} value={rePassword} onChange={handleUserInput} type="password" name="rePassword" />
            {rePassword && <div className="invalid-feedback">{rePasswordError}</div>}
          </div>

          <button disabled={formValid === false && submitted === true} className="btn btn-success" type="button" onClick={signUp}>Sign up</button>
        </div>
      </div>
    </div>
  </div>;
}

export default ReactHooks;