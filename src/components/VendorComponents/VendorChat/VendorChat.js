import React, { Component } from 'react';
import './VendorChat.scss';
import { store } from '../../../index';
import {
    setEmailText,
    setPasswordText,
    setRePasswordText,
    addUser,
    removeUser,
    sortUserByEmail,
    sortUserByPassword,
    sortUserById,
    sortDefault,
    setSelectedUser,
    changeSelectedUser
} from '../../../store/VendorChat/actions';

class VendorChat extends Component {
  usersRef = React.createRef();

  componentDidMount() {
    store.dispatch(sortDefault())
  }

  render() {
    return <div className="VendorChat">
      <input onChange={this.onEmailChange} value={store.getState().registration.email} placeholder="Email" type="text" /> {/* work without value */}
      <input onChange={this.onPasswordChange} value={store.getState().registration.password} placeholder="Password" type="text" /> {/* work without value */}
      <input onChange={this.onRePasswordChange} value={store.getState().registration.rePassword} placeholder="Re password" type="text" /> {/* work without value */}
      <button onClick={this.addUser}>addUser</button>
      <button onClick={this.changeUserData}>changeUserData</button>

      <div ref={this.usersRef} className="users">
        <div>Users count: {store.getState().registration.users.length}</div>
        <div className="users-header">
          <div onClick={this.sortById} className="id">Sort by id {this.sortDirection('ID')}</div>
          <div onClick={this.sortByEmail} className="email">Sort by email {this.sortDirection('EMAIL')}</div>
          <div onClick={this.sortByPassword} className="password">Sort by password {this.sortDirection('PASSWORD')}</div>
        </div>
        {store.getState().registration.users.map((user, index) => <div onClick={this.selectUser.bind(this, user)} key={index} className={this.setClass(user)}>
          <div>{user.id}</div>
          <div>{user.email}</div>
          <div>{user.password}</div>
          <div onClick={this.removeUser.bind(this, user.id)} className="remove">remove</div>
        </div>)}
      </div>
    </div>;
  }

  changeUserData = (user) => {
    store.dispatch(changeSelectedUser(store.getState().registration.email, store.getState().registration.password, store.getState().registration.rePassword))
  }

  selectUser = (user) => {
    if (user === store.getState().registration.selectUser) {
      store.dispatch(setSelectedUser(null))
    } else {
      store.dispatch(setSelectedUser(user))
    }
  }

  setClass = (user) => {
    if (store.getState().registration.selectedUser === user) {
      return 'user select'
    }

    return 'user'
  }

  sortDirection = (sortField) => {
    const sortedBy = store.getState().registration.usersSortBy;
    if (sortField === 'ID') {
      return sortedBy === 'id' ? '+' : sortedBy === '-id' ? '-' : ''
    }
    if (sortField === 'EMAIL') {
      return sortedBy === 'email' ? '+' : sortedBy === '-email' ? '-' : ''
    }
    if (sortField === 'PASSWORD') {
      return sortedBy === 'password' ? '+' : sortedBy === '-password' ? '-' : ''
    }
  }

  onEmailChange = (event) => {
    store.dispatch(setEmailText(event.target.value));
  }

  onPasswordChange = (event) => {
    store.dispatch(setPasswordText(event.target.value));
  }

  onRePasswordChange = (event) => {
    store.dispatch(setRePasswordText(event.target.value));
  }

  addUser = () => {
    store.dispatch(addUser(store.getState().registration.email, store.getState().registration.password, store.getState().registration.rePassword));
  }

  removeUser = (id, event) => {
    event.stopPropagation();
    store.dispatch(removeUser(id));
  }

  sortByEmail = () => {
    store.dispatch(sortUserByEmail())
  }

  sortByPassword = () => {
    store.dispatch(sortUserByPassword())
  }

  sortById = () => {
    store.dispatch(sortUserById())
  }
}

export default VendorChat;
