import React, { Component } from 'react';
import './ViewProjects.css';
import ReactHooks from '../../ReactHooks';


class ViewProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="container">
        <div>ViewProjects</div>
        <ReactHooks />
      </div>
    );
  }
}

export default ViewProjects;

