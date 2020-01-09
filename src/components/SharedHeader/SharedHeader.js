import React, { Component } from 'react';
import Header from '../Header/index';
import VendorHeader from '../VendorComponents/VendorHeader';
import InvestorHeader from '../InvestorComponents/InvestorHeader';
import history from '../../services/HistoryModule';
import AuthService from '../../services/AuthService';

class SharedHeader extends Component {
  render() {
    return <div>
      {AuthService.user$.value == null && <Header history={history} />}
      {AuthService.user$.value != null && AuthService.user$.value.role === 'Vendor' && <VendorHeader history={history} />}
      {AuthService.user$.value != null && AuthService.user$.value.role === 'Investor' && <InvestorHeader history={history} />}
    </div>;
  }
}

export default SharedHeader;
