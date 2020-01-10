import React, { Component } from 'react';
import './FilteredProject.scss';
import { highlighter } from '../../services/Highlighter';

class FilteredProject extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="FilteredProject">
        <div className="avatara-wrapper">
          <div className="avatara" style={{ backgroundImage: this.getAvataraUrl(this.props.project) }}></div>
          <div className="rating">{this.props.project.rating}</div>
        </div>
        <div className="project-name">Project name: {highlighter(this.props.project.name, this.props.searchWord)}</div>
        <div className="company-name">Company name: {highlighter(this.props.project.legalEntityName, this.props.searchWord)}</div>
        <div className="region">Region: {this.props.project.region}</div>
        <div className="company-age">Company age: {this.props.project.companyAge}</div>
        <div className="money-required">Money required: {this.props.project.moneyRequired}</div>
        <div className="spheres-activity">
          <div>Spheres activity:</div>
          {this.props.project.spheresActivity.map((sphere, index) => {
            return <div key={index} className="spheres-activity-item">{sphere}</div>
          })}
        </div>
      </div>
    );
  }

  getAvataraUrl = (project) => {
    const url = project.avatara.url;
    return 'url("' + url + '")';
  }
}

export default FilteredProject;