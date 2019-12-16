import React, { Component } from 'react';
import './Progress.scss';

class Progress extends Component {

  static defaultProps = {
    fixed: false,
  }

  render() {
    const style = {};
    if (this.props.fixed === true) {
      style.position = 'fixed'
    } else {
      style.position = 'block'
    }

    return <div style={style} className="Progress">
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated w-100" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>;
  }
}

export default Progress;
