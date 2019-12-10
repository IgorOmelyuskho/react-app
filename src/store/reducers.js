import { combineReducers } from 'redux';
import { authReducer } from './VendorInvestmentOffer/reducers';
import { registrationReducer } from './VendorChat/reducers';

export default combineReducers({
  auth: authReducer,
  registration: registrationReducer
})