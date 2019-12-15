export const REGISTRATION_CHANGE_EMAIL_TEXT = 'REGISTRATION_CHANGE_EMAIL_TEXT';
export const REGISTRATION_CHANGE_PASSWORD_TEXT = 'REGISTRATION_CHANGE_PASSWORD_TEXT';
export const REGISTRATION_CHANGE_RE_PASSWORD_TEXT = 'REGISTRATION_CHANGE_RE_PASSWORD_TEXT';
export const REGISTRATION_ADD_USER = 'REGISTRATION_ADD_USER';
export const REGISTRATION_REMOVE_USER = 'REGISTRATION_REMOVE_USER';
export const REGISTRATION_SORT_USER_BY_EMAIL = 'REGISTRATION_SORT_USER_BY_EMAIL';
export const REGISTRATION_SORT_USER_BY_PASSWORD = 'REGISTRATION_SORT_USER_BY_PASSWORD';
export const REGISTRATION_SORT_USER_BY_ID = 'REGISTRATION_SORT_USER_BY_ID';
export const REGISTRATION_SORT_DEFAULT = 'REGISTRATION_SORT_DEFAULT';
export const REGISTRATION_SET_SELECTED_USER = 'REGISTRATION_SET_SELECTED_USER';
export const REGISTRATION_CHANGE_SELECTED_USER = 'REGISTRATION_CHANGE_SELECTED_USER';
export const REGISTRATION_SET_LOADER_VISIBLE = 'REGISTRATION_SET_LOADER_VISIBLE';


// action creators
export const setEmailText = email => ({
  type: REGISTRATION_CHANGE_EMAIL_TEXT,
  payload: email
})

export const setPasswordText = password => ({
  type: REGISTRATION_CHANGE_PASSWORD_TEXT,
  payload: password
})

export const setRePasswordText = rePassword => ({
  type: REGISTRATION_CHANGE_RE_PASSWORD_TEXT,
  payload: rePassword
})

export const addUser = (email, password, rePassword) => {
  return {
    type: REGISTRATION_ADD_USER,
    payload: { email, password, rePassword }
  }
}

export const removeUser = (id) => ({
  type: REGISTRATION_REMOVE_USER,
  payload: id
})

export const sortUserByEmail = () => ({
  type: REGISTRATION_SORT_USER_BY_EMAIL,
  payload: null
})

export const sortUserByPassword = () => ({
  type: REGISTRATION_SORT_USER_BY_PASSWORD,
  payload: null
})

export const sortUserById = () => ({
  type: REGISTRATION_SORT_USER_BY_ID,
  payload: null
})

export const sortDefault = () => ({
  type: REGISTRATION_SORT_DEFAULT,
  payload: null
})

export const setSelectedUser = (user, setNull) => ({
  type: REGISTRATION_SET_SELECTED_USER,
  payload: { user, setNull }
})

export const changeSelectedUserData = (email, password, rePassword) => ({
  type: REGISTRATION_CHANGE_SELECTED_USER,
  payload: { email, password, rePassword }
})

export const setLoaderVisible = (visible) => ({
  type: REGISTRATION_SET_LOADER_VISIBLE,
  payload: visible
})




// thunks 
export const sortByUserIdAsync = () => {
  return dispatch => {
    dispatch(setLoaderVisible(true));
    setTimeout(() => {
      dispatch(sortUserById());
      dispatch(setLoaderVisible(false));
    }, 2000)
  }
};