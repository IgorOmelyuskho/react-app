import { AUTH_CHANGE_EMAIL_TEXT, AUTH_CHANGE_PASSWORD_TEXT } from './actions';

const defaultState = {
  email: '',
  password: '',
}

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_CHANGE_EMAIL_TEXT:
      return {
        ...state,
        email: action.payload
      }
    case AUTH_CHANGE_PASSWORD_TEXT:
      return {
        ...state,
        password: action.payload
      }
    default: return state
  }
}

export default authReducer;