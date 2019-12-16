import React, { Component } from 'react';
import './VendorChat.scss';
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
  changeSelectedUserData,
  sortByUserIdAsync,
  applyFilter
} from '../../../store/VendorChat/actions';
import VendorChat from './index';
import { connect } from 'react-redux';

// for way 1
// class VendorChatContainer extends Component {
//   render() {
//     return <VendorChat
//       email={this.props.email}
//       password={this.props.password}
//       rePassword={this.props.rePassword}
//       users={this.props.users}
//       selectedUser={this.props.selectedUser}
//       usersSortBy={this.props.usersSortBy}

//       setEmailText={this.props.setEmailText}
//       setPasswordText={this.props.setPasswordText}
//       setRePasswordText={this.props.setRePasswordText}
//       addUser={this.props.addUser}
//       removeUser={this.props.removeUser}
//       sortUserByEmail={this.props.sortUserByEmail}
//       sortUserByPassword={this.props.sortUserByPassword}
//       sortUserById={this.props.sortUserById}
//       sortDefault={this.props.sortDefault}
//       setSelectedUser={this.props.setSelectedUser}
//       changeSelectedUserData={this.props.changeSelectedUserData}
//     />
//   }
// }


const mapStateToProps = state => {
  const st = state.registration;
  return {
    email: st.email,
    password: st.password,
    rePassword: st.rePassword,
    users: st.users,
    selectedUser: st.selectedUser,
    usersSortBy: st.usersSortBy,
    loaderVisible: st.loaderVisible,
    usersFilter: st.usersFilter,
    usersFiltered: st.usersFiltered
  }
}

const mapDispatchToProps = {
  sortDefault,
  setEmailText,
  addUser,
  setPasswordText,
  setRePasswordText,
  removeUser,
  sortUserByEmail,
  sortUserByPassword,
  sortUserById,
  setSelectedUser,
  changeSelectedUserData,
  sortByUserIdAsync,
  applyFilter
}

// for way 2
export default connect(mapStateToProps, mapDispatchToProps)(VendorChat);


// for way 1
// export default connect(mapStateToProps, mapDispatchToProps)(VendorChatContainer);
