import React, { Component } from 'react';
import './VendorMainRight.scss';
import classNames from 'classnames';
import VendorChat from '../VendorChat/index';
import VendorInvestmentOffer from '..//VendorInvestmentOffer/index';
import { translate } from '../../../services/TranslateService';

class VendorMainRight extends Component {
  self = 'VendorMainRight';
  
  constructor(props) {
    super(props);
    this.state = {
      messages_show: false,
      investment_offer_show: false,
    }
  }

  render() {
    return <div className="VendorMainRight">
      {this.state.messages_show && <VendorChat />}
      {this.state.investment_offer_show && <VendorInvestmentOffer />}

      {/* right menu  */}
      <div className="right-menu" id="vendor-main-screen-right-menu">
        {(this.state.investment_offer_show || this.state.messages_show) && <img onClick={this.close} className="close-menu" src="/images/close-2.png" alt="" />}
        <div data-toggle="tooltip" title={translate(this.self, 'chat')} onClick={this.showMessages} className={classNames({ message: true, selected: this.state.messages_show })}>
          <div className="img-bg"></div>
        </div>
        <div data-toggle="tooltip" title={translate(this.self, 'investmentOffer')} onClick={this.showInvestmentOffer} className={classNames({ "investment-offer": true, selected: this.state.investment_offer_show })}>
          <div className="img-bg"></div>
        </div>
      </div>
    </div>;
  }

  showMessages = () => {
    this.setState({
      investment_offer_show: false,
      messages_show: !this.state.messages_show
    })
  }

  showInvestmentOffer = () => {
    this.setState({
      investment_offer_show: !this.state.investment_offer_show,
      messages_show: false
    })
  }

  close = () => {
    this.setState({
      investment_offer_show: false,
      messages_show: false
    })
  }
}

export default VendorMainRight;
