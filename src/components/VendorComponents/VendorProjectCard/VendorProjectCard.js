import React, { Component } from 'react';

class VendorProjectCard extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <div className="project">
        <div className="avatara-wrapper">
          <div className="avatara"></div>
          <div className="rating">{this.props.project.rating}</div>
        </div>
        <div className="short-project-info">
          <div className="bottom-info">
            <div className="d-flex">
              <h5 className="project-name">{this.props.project.name}</h5>
            </div>
            <img src="" alt="" />
          </div>
          <div className="name-and-region">
            <div className="company-name">{this.props.project.legalEntityName}</div>
            <div>
              <i className="fa fa-map-marker mr-2"></i>
              <span className="region"></span>
            </div>
          </div>
          <div className="money-and-sphere">
            <div className="field-activity">
              <img src="" alt="" />
            </div>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

export default VendorProjectCard;
