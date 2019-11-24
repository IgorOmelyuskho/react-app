import React, { Component } from 'react';
import ProjectsService from '../../../services/ProjectsService';
import VendorProjectCard from '../VendorProjectCard/index';

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
      <button className="btn btn-green mt-3">New project</button>

      <div className="for-scroll">
        <div id="projects-1-for-muuri">
          {this.state.projects.map(project =>
            <div key={project.id} className="project">
              <VendorProjectCard project={project}></VendorProjectCard>
            </div>
          )}
        </div>
      </div>
    </div>;
  }
}

export default VendorProjects;

