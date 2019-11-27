import React, { Component } from 'react';
import './VendorMainRight.scss';
import classNames from 'classnames';

class VendorMainRight extends Component {
  render() {
    return <div className="VendorMainRight">
      <div>text</div>

      {/* right menu  */}
      <div className="right-menu" id="vendor-main-screen-right-menu">
        <div data-toggle="tooltip" title="chat" onClick={this.showMessages} className={classNames({ message: true, selected: this.messages_show })}>
          <div className="img-bg"></div>
        </div>
        <div data-toggle="tooltip" title="investmentOffer" onClick={this.showInvestmentOffer} className={classNames({ "investment-offer": true, selected: this.investment_offer_show })}>
          <div className="img-bg"></div>
        </div>
      </div>
    </div>;
  }

  showMessages = () => {

  }

  showInvestmentOffer = () => {

  }
}

export default VendorMainRight;
