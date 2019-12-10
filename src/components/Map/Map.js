import React, { Component } from 'react';
import './Map.scss';
import MapManager from './MapManager';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import './Map.scss';
import Progress from '../Progress/index';

class Map extends Component {
  mapManager;
  mapIsFinishInit = false;
  bufferGeoObjectsArr = [];
  showProgressBarSubscription;
  fromChangeExtentEvent$ = new BehaviorSubject(null);

  constructor(props) {
    super(props);

    this.state = {
      showProgressBar: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.replace3DObjects != null) {
      for (let i = 0; i < nextProps.replace3DObjects.length; i++) {
        nextProps.replace3DObjects[i].coords = {};
        nextProps.replace3DObjects[i].coords.x = 35.028 + Math.random() * 0.004;
        nextProps.replace3DObjects[i].coords.y = 48.474 + Math.random() * 0.004;
      }

      if (this.mapIsFinishInit === true) {
        this.replaceObjects(nextProps.replace3DObjects);
      } else {
        this.bufferGeoObjectsArr = nextProps.replace3DObjects;
      }
    }
  }

  componentDidMount() {
    this.mapManager = new MapManager(
      this.mapFinishInitCallback,
      {
        mapWrapperId: 'map-wrapper-html-element-id-3585349',
        mapId: 'map-html-element-id-495367235',
        labelRendererId: 'label-renderer-843744329'
      },
      this.mapService,
      this.projectsService
    );

    this.mapManager.setObjectClickCallback(this.clickObjectCallback);
    this.mapManager.setObjectHoverCallback(this.hoverObjectCallback);
    this.mapManager.setChangeExtentCallback(this.changeExtentCallback);

    this.fromChangeExtentEvent$
      .pipe(
        debounceTime(800),
      )
      .subscribe(extent => {
        if (extent != null) {
          if (this.props.changeExtent != null) {
            this.props.changeExtent(extent);
          }
        }
      });
  }

  render() {
    return <div className="Map">
      <div id="map-wrapper-html-element-id-3585349">
        <div className="progress-bar-wrapper">
          {/* {this.state.showProgressBar && <Progress />} */}
        </div>
        <div id="map-html-element-id-495367235"></div>
      </div>

      <div id="edit-panel-label" className="edit-panel-label-class">
        <div className="close"></div>
        <div className="rotate-container">
          <div className="rotate-left">
            <div className="left"></div>
            <div className="rotate-text">rotateLeft</div>
          </div>
          <div className="rotate-right">
            <div className="right"></div>
            <div className="rotate-text ">rotateRight</div>
          </div>
        </div>
        <div className="scale-container">
          <div className="slider">
            <img src="../../../assets/img/slider.png" alt="" />
          </div>
          <div className="slider-range"></div>
          <div className="scale-text">changeSize</div>
        </div>
      </div>


      <div id="obj-edit-label" className="obj-edit-label-class">
        <div className="wrapper">
          <img src="../../../assets/img/edit.png" alt="" />
          <div className="text">&nbsp;edit</div>
        </div>
      </div>
    </div>;
  }

  mapFinishInitCallback = () => {
    if (this.bufferGeoObjectsArr != null) {
      this.replaceObjects(this.bufferGeoObjectsArr);
    }
    this.mapIsFinishInit = true;
    this.fromChangeExtentEvent$.next(this.mapManager.getExtent());
    // this.signalRService.signalRConnect(this.mapManager.signalRMessage); // or connect when sign in ?
  }

  clickObjectCallback = (geoObject) => {
    if (this.props.objectClick != null) {
      this.props.objectClick(geoObject);
    }
  }

  hoverObjectCallback = (geoObject, enableObjectEditMode) => {
    if (this.props.objectHover != null) {
      this.props.objectHover({ geoObject, enableObjectEditMode });
    }
  }

  changeExtentCallback = (extent) => {
    this.fromChangeExtentEvent$.next(extent);
  }

  replaceObjects(objects) {
    try {
      if (objects != null && this.mapManager != null) {
        this.mapManager.mapReplaceObjects(objects);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default Map;
