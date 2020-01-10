import React, { Component } from 'react';
import './InvestorFindProjects.scss';
import ProjectsService from '../../../services/ProjectsService';

export default class InvestorFindProjects extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {};
  // }
  componentDidMount() {
    ProjectsService.filteringProjects({ ss: 1, dd: 2 })
  }

  render() {
    return <div className="InvestorFindProjects">Hello! component investorFindProjects</div>;
  }
}
