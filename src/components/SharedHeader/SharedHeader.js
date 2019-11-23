import React, { Component } from 'react';
import Header from '../Header/index';
import history from '../../services/HistoryModule';
import AuthService from '../../services/AuthService';

class SharedHeader extends Component {
  render() {
    return <div>
      {/* <div>{AuthService.user}</div> */}
      <div>text</div>
      <Header history={history} />
    </div>;
  }
}

export default SharedHeader;
