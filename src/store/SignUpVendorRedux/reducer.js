import {
  SIGN_UP_VENDOR_REDUX_UPDATE
} from './actions';


const defaultState = {
  formValid: false,
  submitted: false,
  fullName: "",
  fullNameError: 'fullName is required',
  email: "",
  emailError: 'Email is required',
  password: "",
  passwordError: 'Password is required',
  rePassword: "",
  rePasswordError: 'Repeat password is required',
}

const signUpVendorReduxReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SIGN_UP_VENDOR_REDUX_UPDATE:
      return {
        ...state,
        ...action.payload
      }

    default: return state;
  }
}

export default signUpVendorReduxReducer;
