import React, { Component } from 'react';
import './VendorChat.scss';
import Progress from '../../Progress';
import { highlighter } from '../../../services/Highlighter';


class VendorChat extends Component {
  usersRef = React.createRef();

  componentDidMount() {
    this.props.sortDefault();
  }

  render() {
    return <div className="VendorChat">
      {this.props.loaderVisible ? <Progress /> : null}
      <input onChange={this.onEmailChange} value={this.props.email} placeholder="Email" type="text" />
      <input onChange={this.onPasswordChange} value={this.props.password} placeholder="Password" type="text" />
      <input onChange={this.onRePasswordChange} value={this.props.rePassword} placeholder="Re password" type="text" />
      <button onClick={this.addUser}>addUser</button>
      <button onClick={this.changeUserData}>changeUserData</button>
      <button onClick={this.sortByUserIdAsync}>sortByUserIdAsync</button>
      <input onChange={this.onUsersFilter} value={this.props.usersFilter} placeholder="Filter" type="text" />

      <div ref={this.usersRef} className="users">
        <div>All users count: {this.props.users.length}</div>
        <div>Users count by filter: {this.props.usersFiltered.length}</div>
        <div className="users-header">
          <div onClick={this.sortById} className="id">Sort by id {this.sortDirection('ID')}</div>
          <div onClick={this.sortByEmail} className="email">Sort by email {this.sortDirection('EMAIL')}</div>
          <div onClick={this.sortByPassword} className="password">Sort by password {this.sortDirection('PASSWORD')}</div>
        </div>
        {this.props./* users */usersFiltered.map((user, index) => <div onClick={this.selectUser.bind(this, user)} key={index} className={this.setClass(user)}>
          <div>{user.id}</div>
          <div>{highlighter(user.email, this.props.usersFilter)}</div>
          <div>{highlighter(user.password, this.props.usersFilter)}</div>
          <div onClick={this.removeUser.bind(this, user.id)} className="remove">remove</div>
        </div>)}
      </div>
    </div>;
  }

  onUsersFilter = event => {
    this.props.applyFilter(event.target.value);
  }

  sortByUserIdAsync = () => {
    this.props.sortByUserIdAsync();
  }

  changeUserData = user => {
    this.props.changeSelectedUserData(this.props.email, this.props.password, this.props.rePassword)
  }

  selectUser = user => {
    this.props.setSelectedUser(user, true)
  }

  setClass = user => {
    if (this.props.selectedUser === user) {
      return 'user select'
    }

    return 'user'
  }

  sortDirection = sortField => {
    const sortedBy = this.props.usersSortBy;
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

  onEmailChange = event => {
    this.props.setEmailText(event.target.value);
  }

  onPasswordChange = event => {
    this.props.setPasswordText(event.target.value);
  }

  onRePasswordChange = event => {
    this.props.setRePasswordText(event.target.value);
  }

  addUser = () => {
    this.props.addUser(this.props.email, this.props.password, this.props.rePassword);
  }

  removeUser = (id, event) => {
    event.stopPropagation();
    this.props.removeUser(id);
  }

  sortByEmail = () => {
    this.props.sortUserByEmail();
  }

  sortByPassword = () => {
    this.props.sortUserByPassword();
  }

  sortById = () => {
    this.props.sortUserById();
  }
}

export default VendorChat;
