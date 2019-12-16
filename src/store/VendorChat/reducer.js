import {
  REGISTRATION_CHANGE_EMAIL_TEXT,
  REGISTRATION_CHANGE_RE_PASSWORD_TEXT,
  REGISTRATION_CHANGE_PASSWORD_TEXT,
  REGISTRATION_ADD_USER,
  REGISTRATION_REMOVE_USER,
  REGISTRATION_SORT_USER_BY_EMAIL,
  REGISTRATION_SORT_USER_BY_PASSWORD,
  REGISTRATION_SORT_USER_BY_ID,
  REGISTRATION_SORT_DEFAULT,
  REGISTRATION_SET_SELECTED_USER,
  REGISTRATION_CHANGE_SELECTED_USER,
  REGISTRATION_SET_LOADER_VISIBLE,
  REGISTRATION_APPLY_FILTER
} from './actions';


const defaultState = {
  email: '11',
  password: '22',
  rePassword: '33',
  users: [],
  usersSortBy: 'id', // id, -id, email, -email, password, -password
  usersId: 0,
  selectedUser: null,
  loaderVisible: false,
  usersFilter: '',
  usersFiltered: [],
}

const registrationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTRATION_CHANGE_EMAIL_TEXT:
      return {
        ...state,
        email: action.payload
      }
    case REGISTRATION_CHANGE_PASSWORD_TEXT:
      return {
        ...state,
        password: action.payload
      }
    case REGISTRATION_CHANGE_RE_PASSWORD_TEXT:
      return {
        ...state,
        rePassword: action.payload
      }
    case REGISTRATION_ADD_USER: {
      const users = state.users.concat({ ...action.payload, id: state.usersId++ })
      return {
        ...state,
        users,
        usersFiltered: usersFiltered(state.usersFilter, users)
      }
    }
    case REGISTRATION_REMOVE_USER: {
      let selectedUser = state.selectedUser;
      if (selectedUser && selectedUser.id === action.payload) {
        selectedUser = null;
      }
      const users = state.users.filter(user => user.id !== action.payload)
      return {
        ...state,
        users,
        selectedUser: selectedUser,
        usersFiltered: usersFiltered(state.usersFilter, users)
      }
    }
    case REGISTRATION_SORT_USER_BY_EMAIL: {
      const sortBy = state.usersSortBy === 'email' ? '-email' : 'email';
      return {
        ...state,
        usersFiltered: state.usersFiltered.sort(dynamicSort(sortBy)),
        usersSortBy: sortBy
      }
    }
    case REGISTRATION_SORT_USER_BY_PASSWORD: {
      const sortBy = state.usersSortBy === 'password' ? '-password' : 'password';
      return {
        ...state,
        usersFiltered: state.usersFiltered.sort(dynamicSort(sortBy)),
        usersSortBy: sortBy
      }
    }
    case REGISTRATION_SORT_USER_BY_ID: {
      const sortBy = state.usersSortBy === 'id' ? '-id' : 'id';
      return {
        ...state,
        usersFiltered: state.usersFiltered.sort(dynamicSort(sortBy)),
        usersSortBy: sortBy
      }
    }
    case REGISTRATION_SORT_DEFAULT:
      return {
        ...state,
        usersFiltered: state.usersFiltered.sort(dynamicSort('id')),
        usersSortBy: 'id'
      }
    case REGISTRATION_SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: (action.payload.user === state.selectedUser && action.payload.setNull === true) ? null : action.payload.user
      }
    case REGISTRATION_CHANGE_SELECTED_USER: {
      let updatedUser;
      let usersArr = state.users;
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i] === state.selectedUser) {
          updatedUser = {
            ...state.selectedUser,
            email: action.payload.email,
            password: action.payload.password,
            rePassword: action.payload.password,
          }
          usersArr[i] = updatedUser;
          break;
        }
      }
      return {
        ...state,
        selectedUser: updatedUser,
        users: usersArr,
        usersFiltered: usersFiltered(state.usersFilter, usersArr)
      }
    }
    case REGISTRATION_SET_LOADER_VISIBLE:
      return {
        ...state,
        loaderVisible: action.payload
      }
    case REGISTRATION_APPLY_FILTER: {
      const filter = action.payload;
      return {
        ...state,
        usersFilter: filter,
        usersFiltered: usersFiltered(filter, state.users)
      }
    }

    default: return state;
  }
}

function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function usersFiltered(filter, users) {
  const usersFilteredArr = [];
  for (let i = 0; i < users.length; i++) {
    if (
      users[i].email.includes(filter) === true ||
      users[i].password.includes(filter) === true
    ) {
      usersFilteredArr.push(users[i])
    }
  }
  return usersFilteredArr;
}

export default registrationReducer;