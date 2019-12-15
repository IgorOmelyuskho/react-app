import React, { Component } from 'react';
import './VendorInvestmentOffer.scss';
import { store } from '../../../App';
import { setEmailText, setPasswordText } from '../../../store/VendorInvestmentOffer/actions';
import {
    setRePasswordText,
    addUser,
    removeUser,
    sortUserByEmail,
    sortUserByPassword,
    sortUserById,
    sortDefault
} from '../../../store/VendorChat/actions';
import { fromEvent } from 'rxjs';
import { tap, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

class VendorInvestmentOffer extends Component {
  inputRef = React.createRef();
  fromEvent$;

  componentDidMount() {
    store.dispatch(sortDefault());

    this.fromEvent$ = fromEvent(this.inputRef.current, 'input')
    .pipe(
      map(e => e.target.value),
      debounceTime(1000),
      filter(e => e.length >= 3),
      distinctUntilChanged((a, b) => a === b),
      tap(res => {
        // this.searchByScroll = false;
      })
    )
    .subscribe(res => {
      console.log(res);
    });
  }

  render() {
    const email = store.getState().auth.email;
    const password = store.getState().auth.password;

    return <div className="VendorInvestmentOffer">
      <input onChange={this.onEmailChange} value={email} placeholder="Email" type="text"/> 
      <input onChange={this.onPasswordChange} value={password} placeholder="Password" type="text"/>
      <button>SignUp</button>

      <div className="users">
        <div>Users count: {store.getState().registration.users.length}</div>
        <div className="users-header">
          <div onClick={this.sortById} className="id">Sort by id {this.sortDirection('ID')}</div>
          <div onClick={this.sortByEmail} className="email">Sort by email {this.sortDirection('EMAIL')}</div>
          <div onClick={this.sortByPassword} className="password">Sort by password {this.sortDirection('PASSWORD')}</div>
        </div>
        {store.getState().registration.users.map(user => <div key={user.id} className="user">
          <div>{user.id}</div>
          <div>{user.email}</div>
          <div>{user.password}</div>
          <div onClick={this.removeUser.bind(this, user.id)} className="remove">remove</div>
        </div>)}

        <input ref={this.inputRef} placeholder="RXJS" type="text"/>
      </div>
    </div>;
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

  removeUser = (id) => {
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

export default VendorInvestmentOffer;
