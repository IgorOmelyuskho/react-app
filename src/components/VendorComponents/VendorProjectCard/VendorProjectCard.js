import React, { Component } from 'react';
import './VendorProjectCard.scss';
import ProjectsService from '../../../services/ProjectsService';

class VendorProjectCard extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="project" onClick={this.projectClick}>
        <img onClick={this.removeProject} className="remove-btn" src="images/close-2.png" alt="" />
        <div className="avatara-wrapper">
          <div className="avatara" style={{ backgroundImage: this.getAvataraUrl(this.props.project) }}></div>
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

  removeProject = (e) => {
    e.stopPropagation();
    ProjectsService.removeProjectById(this.props.project.id)
      .then(res => {
        this.props.onRemoveProject(this.props.project);
      })
  }

  projectClick = () => {
    if (this.props.onProjectClick != null) {
      this.props.onProjectClick(this.props.project)
    }
  }

  getAvataraUrl = (project) => {
    const url = project.avatara.url;
    return 'url("' + url + '")';
  }
}

export default VendorProjectCard;
