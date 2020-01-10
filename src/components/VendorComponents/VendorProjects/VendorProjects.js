import React, { Component } from 'react';
import './VendorProjects.scss';
import ProjectsService from '../../../services/ProjectsService';
import VendorProjectCard from '../VendorProjectCard/index';
import Navigate from '../../../services/ForProgramRouting/Navigate';

class VendorProjects extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      projects: []
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
      <button onClick={() => Navigate.navigateByUrl('/vendor/new-project')} className="btn btn-primary mt-3">New project</button>

      <div className="for-scroll">
        {this.state.projects.map(project =>
          <div key={project.id} className="project-wrapper">
            <VendorProjectCard project={project} onProjectClick={this.onProjectClick} onRemoveProject={this.onRemoveProject}></VendorProjectCard>
          </div>
        )}
      </div>
    </div>;
  }

  onProjectClick = (project) => {
    Navigate.navigateByUrl('/vendor/project/' + project.id)
  }

  onRemoveProject = (project) => {
    this.setState({
      projects: this.state.projects.filter(proj => proj !== project)
    })
  }
}

export default VendorProjects;

