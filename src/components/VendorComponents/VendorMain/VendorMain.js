import React, { Component } from 'react';
import './VendorMain.scss';
import Map from '../../Map/index';
import { responseProject, female, female2, male, tractor, walt } from '../../../assets/geoObjects';
import VendorMainRight from '../VendorMainRight/index';

class VendorMain extends Component {
  vendorProject;

  constructor(props) {
    super(props);
    this.vendorProject = JSON.parse(JSON.stringify(responseProject));
    const geoObjectsArr = [female, female2, male, tractor, walt]
    this.vendorProject.geoObjects = geoObjectsArr;

   /*  setInterval(() => {
      this.geoObjects = [responseProject];
      this.forceUpdate(); // or use state
    }, 1000) */
  }

  render() {
    return (
      <div className="VendorMain">
        <VendorMainRight />
        <div className="map-wrapper">
          <Map replace3DObjects={this.vendorProject.geoObjects} objectHover={this.objectHover} objectClick={this.objectClick}/>
        </div>
      </div>
    );
  }

  objectHover = (geoObject) => {
    console.log(geoObject);
  }

  objectClick = (objectClick) => {
    console.log(objectClick);
  }
}

export default VendorMain;

