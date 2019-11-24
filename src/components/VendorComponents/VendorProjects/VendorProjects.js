import React, { Component } from 'react';
import './VendorProjects.css';
import ProjectsService from '../../../services/ProjectsService';
import VendorProjectCard from '../VendorProjectCard/index';
import Navigate from '../../../services/ForProgramRouting/ServiceProgramRouting';

class VendorProjects extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      lastClickProject: null
    }
  }
  componentDidMount() {
    this._isMounted = true;
    ProjectsService.fetchVendorProjects()
      .then(projects => {
        for (let i = 0; i < projects.length; i++) {
          if (this._isMounted) {
            this.setState({
              projects: projects,
            })
          }
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return <div className="wrapper">
      <div>last click to project with id: {this.state.lastClickProject}</div>
      <button onClick={() => Navigate.navigateByUrl('/vendor/new-project')} className="btn btn-primary mt-3">New project</button>

      <div className="for-scroll">
        {this.state.projects.map(project =>
          <div key={project.id} className="project-wrapper">
            <VendorProjectCard project={project} onProjectClick={this.onProjectClick}></VendorProjectCard>
          </div>
        )}
      </div>
    </div>;
  }

  onProjectClick = (project) => {
    this.setState({
      lastClickProject: project.id
    })
  }
}

export default VendorProjects;

