import { combineReducers } from 'redux';
import authReducer from './VendorInvestmentOffer/reducer';
import registrationReducer from './VendorChat/reducer';
import signUpVendorReduxReducer from './SignUpVendorRedux/reducer';

export default combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  signUpVendorRedux: signUpVendorReduxReducer
})