
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { regionalCentersCoords } from '../../../src/assets/regional-centers-coords';
import AuthService from '../../services/AuthService';

var MapZoomEnum;
(function (MapZoomEnum) {
  MapZoomEnum["BIG"] = "BIG";
  MapZoomEnum["AVG"] = "AVG";
  MapZoomEnum["SMALL"] = "SMALL";
})(MapZoomEnum || (MapZoomEnum = {}));

export default class MapManager {
  constructor(cb, htmlId, mapService, projectsService) {
    // map drag and drop
    this.object3DAndProject = null;
    this.dragStarted = false;
    this.showProgressWhenDropObject = new ReplaySubject(1);

    this.mapService = mapService;
    this.projectsService = projectsService;
    // constants region
    this.bigZoom = 17;
    this.deltaZoom = 0.2;
    this.avgZoom = 14;
    this.initZoom = 18;
    this.updatedInterval = 3500;
    this.drawInterval = 50;
    // callbacks
    this.on_click_object = null;
    this.on_hover_object = null;
    this.on_map_init = null;
    this.on_map_change_extent = null;
    // fields
    this.canvasElem = null;
    this.scene = null;
    this.raycaster = null;
    this.mouse = null;
    this.selectedObject = null;
    this.map = null;
    this.objectsArr = [];
    this.timerForDraw = null;
    this.animationFrame = null;
    this.mapElement = null;
    this.mapWrapperElement = null;
    this.threeLayer = null;
    this.clusterLayer = null;
    this.polygonLayer = null;
    this.labelRenderer = null;
    this.camera = null;
    this.prevClusterGeoObjectId = null;
    this.selectedForEditObject = null;
    this.mouseBtnClicked = false;
    this.enabledObjectDrag = false;
    this.updateGeoObjectSubject = new ReplaySubject(1);
    this.signalRMessage = (message) => {
      for (let i = 0; i < this.objectsArr.length; i++) {
        if (message.object3DId === this.objectsArr[i].geoObjectId) {
          this.objectsArr[i].prevCoords.x = this.objectsArr[i].coords.x;
          this.objectsArr[i].prevCoords.y = this.objectsArr[i].coords.y;
          this.objectsArr[i].speedX = (message.positionX - this.objectsArr[i].prevCoords.x) * this.drawInterval / this.updatedInterval;
          this.objectsArr[i].speedY = (message.positionY - this.objectsArr[i].prevCoords.y) * this.drawInterval / this.updatedInterval;
          if (this.objectsArr[i].pointForMove) {
            const v = this.threeLayer.coordinateToVector3(new window.THREE.Vector3(message.positionX, message.positionY, 0.1));
            this.objectsArr[i].pointForMove.position.x = v.x;
            this.objectsArr[i].pointForMove.position.y = v.y;
          }
          return;
        }
      }
    };
    this.windowResize = (event) => {
      const x = this.mapWrapperElement.clientWidth; // offsetWidth
      const y = this.mapWrapperElement.clientHeight; // offsetHeight
      // mapElement width and height 100% in styles.scss
      this.labelRenderer.setSize(x, y);
    };
    this.animation = () => {
      this.animationFrame = requestAnimationFrame(this.animation);
      if (this.labelRenderer != null && this.scene != null && this.camera != null) {
        this.labelRenderer.render(this.scene, this.camera);
      }
    };
    this.labelMouseLeaveHandler = (event) => {
      if (event.target['geoObject'] !== this.selectedObject) {
        event.target['geoObject'].objectDivLabel.className = 'obj-label';
      }
    };
    this.mtlLoad = (onLoadCb, onErrorCb, zipManager, pathToFolder, mtlFileName) => {
      const mtlLoader = new window.THREE.MTLLoader(zipManager);
      mtlLoader.setPath(pathToFolder);
      mtlLoader.load(mtlFileName, onLoadCb, null, onErrorCb);
    };
    this.mtlLoadOnLoad = (materials, zipManager, pathToFolder, objFileName, geoObject, cbObjectLoaded) => {
      this.objLoad((object3D) => { this.objLoadOnLoad(object3D, geoObject, cbObjectLoaded); }, (err) => { console.error(err); }, zipManager, materials, pathToFolder, objFileName);
    };
    this.objLoad = (onLoadCb, onErrorCb, zipManager, materials, pathToFolder, objFileName) => {
      materials.preload();
      const objLoader = new window.THREE.OBJLoader(zipManager);
      objLoader.setMaterials(materials);
      objLoader.setPath(pathToFolder);
      objLoader.load(objFileName, onLoadCb, null, onErrorCb);
    };
    this.objLoadOnLoad = (object3D, geoObject, cbObjectLoaded) => {
      geoObject.object3DHPStartLoaded = false;
      this.init3dObject(geoObject, object3D, cbObjectLoaded);
    };
    this.labelMouseEnterHandler = (event) => {
      event.target['geoObject'].objectDivLabel.className = 'obj-label-selected';
      if (this.on_hover_object != null) {
        const enableObjectEditMode = this.selectedForEditObject != null;
        this.on_hover_object(event.target['geoObject'], enableObjectEditMode);
      }
    };
    this.labelMouseClickHandler = (event) => {
      if (this.selectedObject != null) {
        this.selectedObject.objectDivLabel.className = 'obj-label';
        this.setMarkerSymbolDefault(this.selectedObject.marker);
      }
      this.selectedObject = event.target['geoObject'];
      this.selectedObject.objectDivLabel.className = 'obj-label-selected';
      this.setMarkerSymbolSelected(this.selectedObject.marker);
      if (this.on_click_object != null) {
        this.on_click_object(this.selectedObject);
      }
    };
    this.editBtnLabelClickHandler = (event) => {
      if (this.selectedForEditObject != null) {
        this.selectedForEditObject.editPanelLabel.style.display = 'none';
        this.selectedForEditObject.editBtnLabel.style.display = 'block';
      }
      const geoObject = event.target.closest('.obj-edit-label-class')['geoObject'];
      this.selectedForEditObject = geoObject;
      this.selectedForEditObject.editBtnLabel.style.display = 'none';
      this.selectedForEditObject.editPanelLabel.style.display = 'block';
      this.selectedForEditObject.enabledEditMode = true;
    };
    this.rotateLeft = () => {
      if (this.selectedForEditObject == null) {
        return;
      }
      this.rotateLeftInterval = setInterval(() => {
        this.selectedForEditObject.rotate -= 0.01;
        this.updateGeoObjectSettings(this.selectedForEditObject);
      }, this.drawInterval);
    };
    this.stopRotateLeft = () => {
      if (this.rotateLeftInterval != null) {
        clearInterval(this.rotateLeftInterval);
      }
    };
    this.rotateRight = () => {
      if (this.selectedForEditObject == null) {
        return;
      }
      this.rotateRightInterval = setInterval(() => {
        this.selectedForEditObject.rotate += 0.01;
        this.updateGeoObjectSettings(this.selectedForEditObject);
      }, this.drawInterval);
    };
    this.stopRotateRight = () => {
      if (this.rotateRightInterval != null) {
        clearInterval(this.rotateRightInterval);
      }
    };
    this.when3DObjectLoaded = () => {
      this.showProgressWhenDropObject.next(false);
    };
    this.mapWrapperId = htmlId.mapWrapperId;
    this.mapId = htmlId.mapId;
    this.labelRendererId = htmlId.labelRendererId;
    this.mapInit(cb);
    this.updateGeoObjectSubject
      .pipe(debounceTime(1000))
      .subscribe((historyPosition) => {
        this.mapService.updateGeoObjectSettings(historyPosition).subscribe();
      });
  }
  setCenterByProjectRegion(region) {
    for (let i = 0; i < regionalCentersCoords.length; i++) {
      if (regionalCentersCoords[i].value === region) {
        this.map.setCenter(new window.maptalks.Coordinate(regionalCentersCoords[i].x, regionalCentersCoords[i].y));
        if (this.on_map_change_extent != null) {
          const extent = this.getExtent();
          this.on_map_change_extent(extent);
        }
        return;
      }
    }
  }
  mapDestroy() {
    clearInterval(this.timerForDraw);
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.windowResize);
    this.canvasElem = null;
    this.scene = null;
    this.threeLayer = null;
    this.raycaster = null;
    this.mouse = null;
    this.selectedObject = null;
    this.map = null;
    this.objectsArr = [];
    this.timerForDraw = null;
    this.animationFrame = null;
    this.mapElement = null;
    this.mapWrapperElement = null;
    this.clusterLayer = null;
    this.polygonLayer = null;
    this.camera = null;
    this.prevClusterGeoObjectId = null;
    this.selectedForEditObject = null;
    this.rotateLeftInterval = null;
    this.rotateRightInterval = null;
    this.on_click_object = null;
    this.on_hover_object = null;
    this.on_map_init = null;
    this.on_map_change_extent = null;
    this.updateGeoObjectSubject.unsubscribe();
  }
  mapSetFullScreen() {
    const e = document.documentElement;
    const g = document.body;
    const x = window.innerWidth || e.clientWidth || g.clientWidth;
    const y = window.innerHeight || e.clientHeight || g.clientHeight;
    this.mapWrapperElement.style.width = x + 'px';
    this.mapWrapperElement.style.height = y + 'px';
    this.mapElement.style.width = x + 'px';
    this.mapElement.style.height = y + 'px';
    this.labelRenderer.setSize(this.mapElement.clientWidth, this.mapElement.clientHeight);
  }
  object3DDtoToGeoObject(object3DDto, object3DId, project) {
    const geoObject = {
      geoObjectId: object3DId,
      project: project,
      coords: {
        x: object3DDto.staticPositionX,
        y: object3DDto.staticPositionY
      },
      path: object3DDto.path,
      canMove: false,
      currentUser: true,
      projectName: project.name,
      rotate: 0
    };
    return geoObject;
  }
  updateGeoObjectSettings(geoObject) {
    const historyPosition = {
      objectId: geoObject.geoObjectId,
      positionX: geoObject.coords.x,
      positionY: geoObject.coords.y,
      scale: geoObject.scale,
      rotate: geoObject.rotate
    };
    this.updateGeoObjectSubject.next(historyPosition);
  }
  // set callbacks
  //#region
  setObjectClickCallback(cb) {
    this.on_click_object = cb;
  }
  setObjectHoverCallback(cb) {
    this.on_hover_object = cb;
  }
  setChangeExtentCallback(cb) {
    this.on_map_change_extent = cb;
  }
  //#endregion
  // add / replace / delete / change GeoObjects or polygons with map, getExtent
  //#region
  mapReplaceObjects(replacementObjectsArr) {
    clearInterval(this.timerForDraw);
    const diff = (x1, x2) => {
      return x1.filter(x => !x2.includes(x));
    };
    // преобразуем массив GeoObject[] в массив geoObjectId
    const objectsArrId = this.objectsArr.map((item) => {
      return item.geoObjectId;
    });
    // преобразуем массив GeoObject[] в массив geoObjectId
    const replacementObjectsArrId = replacementObjectsArr.map((item) => {
      return item.geoObjectId;
    });
    const addArrId = diff(replacementObjectsArrId, objectsArrId); // массив geoObjectId которые нужно добавить
    const leaveArrId = diff(replacementObjectsArrId, addArrId); // массив geoObjectId которые остаются
    const removeArrId = diff(objectsArrId, replacementObjectsArrId); // массив geoObjectId которые нужно удалить
    // const removeArrForPush: GeoObject[] = []; // массив geoObjectId которые нужно удалить
    for (let i = 0; i < removeArrId.length; i++) {
      for (let j = 0; j < this.objectsArr.length; j++) {
        if (removeArrId[i] === this.objectsArr[j].geoObjectId) {
          // removeArrForPush.push(this.objectsArr[j]);
          this.remove3DObjectFromScene(this.objectsArr[j]);
        }
      }
    }
    const leaveArrForPush = []; // массив geoObjectId которые остаются
    for (let i = 0; i < leaveArrId.length; i++) {
      for (let j = 0; j < this.objectsArr.length; j++) {
        if (leaveArrId[i] === this.objectsArr[j].geoObjectId) {
          leaveArrForPush.push(this.objectsArr[j]);
        }
      }
    }
    this.objectsArr = leaveArrForPush; // addArrForPush добавятся в this.objectsArr в методе this.mapAddNewObjects(addArrForPush);
    const addArrForPush = []; // массив geoObjectId которые нужно добавить
    for (let i = 0; i < addArrId.length; i++) {
      for (let j = 0; j < replacementObjectsArr.length; j++) {
        if (addArrId[i] === replacementObjectsArr[j].geoObjectId) {
          addArrForPush.push(replacementObjectsArr[j]);
        }
      }
    }
    this.mapAddNewObjects(addArrForPush);
    this.clusterLayer.clear();
    // тут this.objectsArr включает в себя и leaveArrForPush и addArrForPush,
    // которые были добавлены в методе в методе this.mapAddNewObjects(addArrForPush);
    for (let i = 0; i < this.objectsArr.length; i++) {
      this.clusterLayer.addGeometry(this.objectsArr[i].marker);
    }
    this.timerForDraw = setInterval(() => {
      this.updateCoordsForRedraw();
    }, this.drawInterval);
  }
  mapAddNewObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      this.mapAddNewObject(objects[i]);
    }
  }
  mapAddNewObject(objects, cbObjectLoaded) {
    const newObj = objects;
    newObj.marker = null;
    newObj.object3DHP = null;
    newObj.object3DHPStartLoaded = false;
    newObj.mouseUnder = false;
    newObj.speedX = 0;
    newObj.speedY = 0;
    newObj.prevCoords = {};
    newObj.prevCoords.x = newObj.coords.x;
    newObj.prevCoords.y = newObj.coords.y;
    newObj.enabledEditMode = false;
    if (newObj.scale == null) {
      newObj.scale = 1;
    }
    this.createMarker(newObj);
    this.loadObject3D(newObj, cbObjectLoaded);
    this.objectsArr.push(newObj);
  }
  mapAddNewPolygons(polygons) {
    const initialSymbol = {
      'lineColor': '#334a5e',
      'lineWidth': 1,
      'polygonFill': 'rgb(135,196,240)',
      'polygonOpacity': 0.2
    };
    const hoverSymbol = {
      'lineColor': '#334a5e',
      'lineWidth': 1,
      'polygonFill': 'rgb(135,196,240)',
      'polygonOpacity': 0.5
    };
    for (let i = 0; i < polygons.length; i++) {
      const polygon = new window.maptalks.Polygon(polygons[i], {
        visible: true,
        customName: 'polygon' + i,
        cursor: 'pointer',
        symbol: initialSymbol
      });
      polygon.on('click', (e) => {
        // emit event or do something
      });
      polygon.on('mouseenter', (e) => {
        e.target.setSymbol(hoverSymbol);
      });
      polygon.on('mouseout', (e) => {
        e.target.setSymbol(initialSymbol);
      });
      this.polygonLayer.addGeometry(polygon);
    }
  }
  mapReplacePolygons(polygons) {
    this.polygonLayer.clear();
    this.mapAddNewPolygons(polygons);
  }
  getExtent() {
    const extent = this.map.getExtent();
    const res = {
      lowerBoundX: extent.xmin,
      lowerBoundY: extent.ymin,
      upperBoundX: extent.xmax,
      upperBoundY: extent.ymax,
    };
    return res;
  }
  getCenter() {
    return this.map.getCenter();
  }
  //#endregion
  // private methods
  //#region
  mapInit(cb) {
    this.createMap();
    this.createPolygonLayer();
    this.createClusterLayer();
    this.mapElement = document.getElementById(this.mapId);
    this.mapWrapperElement = document.getElementById(this.mapWrapperId);
    this.canvasElem = this.mapElement.querySelector('canvas');
    this.raycaster = new window.THREE.Raycaster();
    this.mouse = new window.THREE.Vector2();
    this.createLabelRenderer();
    this.animation();
    window.addEventListener('resize', this.windowResize);
    this.on_map_init = cb;
    this.createThreeLayer(); // async
    this.timerForDraw = setInterval(() => {
      this.updateCoordsForRedraw();
    }, this.drawInterval);
  }
  createLabelRenderer() {
    this.labelRenderer = new window.THREE.CSS2DRenderer();
    this.labelRenderer.setSize(this.mapElement.clientWidth, this.mapElement.clientHeight);
    this.labelRenderer.domElement.id = this.labelRendererId;
    this.mapElement.appendChild(this.labelRenderer.domElement);
  }
  createMap() {
    this.map = new window.maptalks.Map(this.mapId, {
      center: [35.028, 48.474],
      zoom: this.initZoom,
      minZoom: 3,
      pitch: 60,
      // bearing: 30,
      // centerCross: true,
      baseLayer: new window.maptalks.TileLayer('tile', {
        'urlTemplate': 'https://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!' +
          '3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965',
        'attribution': '&copy; <a href="http://ditu.google.cn/">Google</a>'
      })
    });
    this.mapZoomEnum = this.detectMapZoom(this.map.getZoom());
    this.mapEventHandlers();
  }
  mapEventHandlers() {
    this.map.on('mousemove', (event) => {
      this.dragSelectedObject(event.coordinate.x, event.coordinate.y);
      this.mouse.x = (event.containerPoint.x / event.target.width) * 2 - 1;
      this.mouse.y = -(event.containerPoint.y / event.target.height) * 2 + 1;
      this.selectObjects();
      const identify = this.clusterLayer.identify(event.coordinate);
      if (identify == null || identify.children == null) {
        this.prevClusterGeoObjectId = null;
        return;
      }
      if (identify.children.length === 1) { // if number 1 on cluster
        if (this.map.getZoom() < this.avgZoom + this.deltaZoom) {
          this.setCanvasCursor('pointer');
        }
        else {
          this.setCanvasCursor('inherit');
        }
        const geoObject = identify.children[0].parent;
        if (geoObject.geoObjectId !== this.prevClusterGeoObjectId) { // so that there are not many events
          if (this.on_hover_object != null) {
            const enableObjectEditMode = this.selectedForEditObject != null;
            this.on_hover_object(geoObject, enableObjectEditMode);
          }
        }
        this.prevClusterGeoObjectId = geoObject.geoObjectId;
      }
      else { // if number 2 or more on cluster
        this.setCanvasCursor('default');
      }
    });
    this.map.on('mouseup', (event) => {
      if (this.dragStarted === true && this.object3DAndProject != null) {
        this.drop(this.object3DAndProject, event.coordinate.x, event.coordinate.y);
      }
    });
    this.map.on('zooming', (event) => {
      this.mapZoomEnum = this.detectMapZoom(event.to);
      for (let i = 0; i < this.objectsArr.length; i++) {
        this.changeVisibleAndScale(this.objectsArr[i]);
      }
    });
    this.map.on('click', (event) => {
    });
    this.map.on('mousedown', (event) => {
      const identify = this.clusterLayer.identify(event.coordinate);
      if (identify && identify.children && identify.children.length === 1) {
        const geoObject = identify.children[0].parent;
        if (this.on_click_object != null) {
          this.on_click_object(geoObject);
        }
      }
      for (let i = 0; i < this.objectsArr.length; i++) {
        if (this.objectsArr[i].mouseUnder === true) {
          if (this.selectedObject != null) {
            if (this.selectedObject.objectDivLabel) {
              this.selectedObject.objectDivLabel.className = 'obj-label';
            }
            this.setMarkerSymbolDefault(this.selectedObject.marker);
          }
          this.selectedObject = this.objectsArr[i];
          if (this.selectedObject.objectDivLabel) {
            this.selectedObject.objectDivLabel.className = 'obj-label-selected';
          }
          this.setMarkerSymbolSelected(this.selectedObject.marker);
          if (this.on_click_object != null) {
            this.on_click_object(this.selectedObject);
          }
        }
      }
      this.mouseBtnClicked = true;
      this.enableObjectDrag();
    });
    this.map.on('mouseup', (event) => {
      this.mouseBtnClicked = false;
      this.disableObjectDrag();
    });
    this.map.on('animateend', (event) => {
      if (this.on_map_change_extent != null) {
        const extent = this.getExtent();
        this.on_map_change_extent(extent);
      }
    });
    this.map.on('moving', (event) => {
      if (this.on_map_change_extent != null) {
        const extent = this.getExtent();
        this.on_map_change_extent(extent);
      }
    });
    this.map.on('dragrotateend', (event) => {
      if (this.on_map_change_extent != null) {
        const extent = this.getExtent();
        this.on_map_change_extent(extent);
      }
    });
  }
  createClusterLayer() {
    this.clusterLayer = new window.maptalks.ClusterLayer('cluster', {
      'noClusterWithOneMarker': false,
      'single': false,
      'drawClusterText': true,
      'geometryEvents': true,
      'animation': false,
      'maxClusterRadius': 50,
      'maxClusterZoom': this.avgZoom,
      // "count" is an internal variable: marker count in the cluster.
      'symbol': {
        'markerType': 'ellipse',
        'markerFill': {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 'rgb(135, 196, 240)'],
            [9, '#1bbc9b'],
            [99, 'rgb(216, 115, 149)']
          ]
        },
        'markerFillOpacity': 0.7,
        'markerLineOpacity': 1,
        'markerLineWidth': 3,
        'markerLineColor': '#fff',
        'markerWidth': {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 40],
            [9, 60],
            [99, 80]
          ]
        },
        'markerHeight': {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 40],
            [9, 60],
            [99, 80]
          ]
        }
      },
    });
    this.map.addLayer(this.clusterLayer);
  }
  createPolygonLayer() {
    this.polygonLayer = new window.maptalks.VectorLayer('polygonLayer');
    this.polygonLayer.addTo(this.map);
  }
  createThreeLayer() {
    window.THREE.Loader.Handlers.add(/\.dds$/i, new window.THREE.DDSLoader());
    this.threeLayer = new window.maptalks.ThreeLayer('threeLayer');
    this.threeLayer.prepareToDraw = (gl, localScene, localCamera) => {
      this.scene = localScene;
      this.camera = localCamera;
      this.scene.add(new window.THREE.AmbientLight(0xffffff, 1.5));
      this.labelRenderer.setSize(this.mapElement.clientWidth, this.mapElement.clientHeight);
      if (this.on_map_init != null) {
        this.on_map_init();
      }
    };
    this.threeLayer.addTo(this.map);
  }
  //#endregion
  // init / remove 3D Object
  //#region
  remove3DObjectFromScene(geoObject) {
    if (geoObject == null) {
      return; // null when object model did not have time to boot
    }
    if (geoObject.pointForMove != null) {
      if (geoObject.pointForMove.geometry) {
        geoObject.pointForMove.geometry.dispose();
      }
      if (geoObject.pointForMove.material) {
        geoObject.pointForMove.material.dispose();
      }
      if (geoObject.pointForMove.texture) {
        geoObject.pointForMove.texture.dispose();
      }
      this.scene.remove(geoObject.pointForMove);
    }
    if (geoObject.boxHelper != null) {
      this.scene.remove(geoObject.boxHelper);
    }
    if (geoObject.objectDivLabel != null) {
      geoObject.objectDivLabel.removeEventListener('mouseenter', this.labelMouseEnterHandler);
      geoObject.objectDivLabel.removeEventListener('mouseleave', this.labelMouseLeaveHandler);
      geoObject.objectDivLabel.removeEventListener('click', this.labelMouseClickHandler);
      geoObject.objectDivLabel.parentNode.removeChild(geoObject.objectDivLabel);
    }
    if (geoObject.editBtnLabel != null) {
      geoObject.editBtnLabel.removeEventListener('click', this.editBtnLabelClickHandler);
      geoObject.editBtnLabel.parentNode.removeChild(geoObject.editBtnLabel);
    }
    if (geoObject.editPanelLabel != null) {
      geoObject.editPanelLabel.parentNode.removeChild(geoObject.editPanelLabel);
    }
    if (geoObject.object3DHP != null) {
      if (geoObject.object3DHP.geometry) {
        geoObject.object3DHP.geometry.dispose();
      }
      if (geoObject.object3DHP.material) {
        geoObject.object3DHP.material.dispose();
      }
      if (geoObject.object3DHP.texture) {
        geoObject.object3DHP.texture.dispose();
      }
      this.scene.remove(geoObject.object3DHP);
    }
  }
  init3dObject(geoObject, object3D, cbObjectLoaded) {
    const childScale = 0.004;
    object3D.traverse((child) => {
      if (child instanceof window.THREE.Mesh) {
        child.scale.set(childScale, childScale, childScale);
        child.rotation.set(Math.PI * 1 / 2, -Math.PI * 1 / 2, 0);
        if (Array.isArray(child.material)) {
          return;
        }
        child.material.initColor = child.material.color.getHex();
      }
    });
    geoObject.object3DHP = object3D;
    const v = this.threeLayer.coordinateToVector3(new window.maptalks.Coordinate(geoObject.coords.x, geoObject.coords.y));
    object3D.position.x = v.x;
    object3D.position.y = v.y;
    object3D.position.z = v.z;
    geoObject.box3 = new window.THREE.Box3().setFromObject(object3D);
    geoObject.object3DHP.scale.set(geoObject.scale, geoObject.scale, geoObject.scale);
    // geoObject.boxHelper = new THREE.BoxHelper(object3D, 0xff0000); // todo remove
    // this.scene.add(geoObject.boxHelper);
    const cubeGeometry = new window.THREE.BoxGeometry(0.1, 0.1, 0.1);
    const cubeMaterial = new window.THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    if (geoObject.canMove === true && geoObject.pointForMove == null) {
      geoObject.pointForMove = new window.THREE.Mesh(cubeGeometry, cubeMaterial);
      this.scene.add(geoObject.pointForMove);
    }
    this.createObjectDivLabel(geoObject);
    this.createObjectEditLabel(geoObject);
    this.createObjectEditPanelLabel(geoObject);
    this.changeVisibleAndScale(geoObject);
    this.scene.add(object3D);
    this.threeLayer.renderScene();
    if (cbObjectLoaded) {
      cbObjectLoaded(geoObject);
    }
  }
  loadObject3D(geoObject, cbObjectLoaded) {
    let pathToZip;
    pathToZip = geoObject.path;
    geoObject.object3DHPStartLoaded = true;
    window.THREE.ZipLoadingManager
      .uncompress(pathToZip, ['.mtl', '.obj', '.jpg', '.png'])
      .then((zip) => {
        const pathToFolder = zip.urls[0].substring(0, zip.urls[0].lastIndexOf('/') + 1);
        let mtlFileName = '';
        let objFileName = '';
        for (let i = 0; i < zip.urls.length; i++) {
          if (zip.urls[i].match('.mtl$')) {
            mtlFileName = zip.urls[i].replace(/^.*[\\\/]/, '');
          }
          if (zip.urls[i].match('.obj$')) {
            objFileName = zip.urls[i].replace(/^.*[\\\/]/, '');
          }
        }
        this.mtlLoad((materials) => { this.mtlLoadOnLoad(materials, zip.manager, pathToFolder, objFileName, geoObject, cbObjectLoaded); }, (err) => { console.error(err); }, zip.manager, pathToFolder, mtlFileName);
      });
  }
  //#endregion
  // labels
  //#region
  createObjectDivLabel(geoObject) {
    const objectDivLabel = document.createElement('div');
    objectDivLabel['geoObject'] = geoObject;
    objectDivLabel.addEventListener('mouseenter', this.labelMouseEnterHandler);
    objectDivLabel.addEventListener('mouseleave', this.labelMouseLeaveHandler);
    objectDivLabel.addEventListener('click', this.labelMouseClickHandler);
    objectDivLabel.className = 'obj-label';
    objectDivLabel.textContent = geoObject.projectName;
    const objLabel = new window.THREE.CSS2DObject(objectDivLabel);
    geoObject.objectDivLabel = objectDivLabel;
    objLabel.position.x = 0;
    objLabel.position.y = 0;
    objLabel.position.z = geoObject.box3.getSize().z * 1.1;
    geoObject.object3DHP.add(objLabel);
  }
  createObjectEditLabel(geoObject) {
    const elemForClone = document.getElementById('obj-edit-label');
    const editLabel = elemForClone.cloneNode(true);
    editLabel.removeAttribute('id');
    editLabel['geoObject'] = geoObject;
    editLabel.style.display = 'block';
    editLabel.addEventListener('click', this.editBtnLabelClickHandler);
    const objLabel = new window.THREE.CSS2DObject(editLabel);
    geoObject.editBtnLabel = editLabel;
    objLabel.position.x = 0;
    objLabel.position.y = 0;
    objLabel.position.z = 0; // for edit panel
    geoObject.object3DHP.add(objLabel);
  }
  createObjectEditPanelLabel(geoObject) {
    const elemForClone = document.getElementById('edit-panel-label');
    const editPanelLabel = elemForClone.cloneNode(true);
    editPanelLabel.removeAttribute('id');
    editPanelLabel['geoObject'] = geoObject;
    editPanelLabel.style.display = 'none';
    this.initNoUiSlider(editPanelLabel.querySelector('.scale-container .slider-range'), geoObject);
    this.initRotateSection(editPanelLabel.querySelector('.rotate-container'));
    this.initCloseBtn(editPanelLabel.querySelector('.close'));
    const objLabel = new window.THREE.CSS2DObject(editPanelLabel);
    geoObject.editPanelLabel = editPanelLabel;
    objLabel.position.x = 0;
    objLabel.position.y = 0;
    objLabel.position.z = 0; // for edit panel
    geoObject.object3DHP.add(objLabel);
  }
  initNoUiSlider(rangeElement, geoObject) {
    const noUiSlider = window['noUiSlider'];
    noUiSlider.create(rangeElement, {
      start: [geoObject.scale],
      connect: true,
      range: {
        'min': 0.1,
        'max': 10
      }
    });
    rangeElement.noUiSlider.on('slide', (values, handle) => {
      const value = values[handle];
      this.editChangeScale(value);
    });
  }
  initRotateSection(rotateSection) {
    const rotateLeftElem = rotateSection.querySelector('.rotate-left');
    rotateLeftElem.addEventListener('mousedown', this.rotateLeft);
    rotateLeftElem.addEventListener('mouseup', this.stopRotateLeft);
    rotateLeftElem.addEventListener('mouseleave', this.stopRotateLeft);
    const rotateRightElem = rotateSection.querySelector('.rotate-right');
    rotateRightElem.addEventListener('mousedown', this.rotateRight);
    rotateRightElem.addEventListener('mouseup', this.stopRotateRight);
    rotateRightElem.addEventListener('mouseleave', this.stopRotateRight);
  }
  initCloseBtn(closeElement) {
    closeElement.addEventListener('click', () => {
      this.selectedForEditObject.editPanelLabel.style.display = 'none';
      if (this.mapZoomEnum === MapZoomEnum.BIG) {
        this.selectedForEditObject.editBtnLabel.style.display = 'block';
      }
      this.selectedForEditObject.enabledEditMode = false;
      this.selectedForEditObject = null;
    });
  }
  //#endregion
  // marker
  //#region
  setMarkerSymbolDefault(marker) {
    marker.updateSymbol({
      'markerWidth': 28,
      'markerHeight': 40,
      'textSize': 16,
      'textFill': 'black',
      'zIndex': 1
    });
    marker.setZIndex(1);
  }
  setMarkerSymbolSelected(marker) {
    marker.updateSymbol({
      'markerWidth': 28 + 5,
      'markerHeight': 40 + 5,
      'textSize': 18,
      'textFill': 'green',
    });
    marker.setZIndex(1000);
  }
  createMarker(geoObject) {
    const coords = new window.maptalks.Coordinate(geoObject.coords.x, geoObject.coords.y);
    const marker = new window.maptalks.Marker(coords, {
      visible: true,
      cursor: 'pointer',
      symbol: [{
        'markerFile': window.location.origin + '/assets/img/marker.svg',
        'markerWidth': 28,
        'markerHeight': 40,
      },
      {
        'textFaceName': 'sans-serif',
        'textName': geoObject.projectName,
        'textSize': 16,
        'textDy': 10,
        'textFill': 'black',
        'textHaloColor': '#fff',
        'textHaloRadius': 2,
      }]
    });
    geoObject.marker = marker;
    geoObject.marker.options.visible = false;
    geoObject.marker.parent = geoObject;
    this.clusterLayer.addGeometry(marker);
    this.markerEventHandlers(marker);
  }
  markerEventHandlers(marker) {
    marker.on('click', (e) => {
      if (this.selectedObject != null) {
        this.selectedObject.objectDivLabel.className = 'obj-label';
        this.setMarkerSymbolDefault(this.selectedObject.marker);
      }
      this.selectedObject = e.target.parent;
      this.selectedObject.objectDivLabel.className = 'obj-label-selected';
      this.setMarkerSymbolSelected(this.selectedObject.marker);
      if (this.on_click_object != null) {
        this.on_click_object(this.selectedObject);
      }
    });
    marker.on('mouseenter', (e) => {
      this.setMarkerSymbolSelected(e.target); // e.target === marker
      if (this.on_hover_object != null) {
        const enableObjectEditMode = this.selectedForEditObject != null;
        this.on_hover_object(e.target.parent, enableObjectEditMode);
      }
    });
    marker.on('mouseout', (e) => {
      if (e.target.parent !== this.selectedObject) {
        this.setMarkerSymbolDefault(e.target);
      }
    });
  }
  //#endregion
  // draw depending coordinates
  //#region
  customRedraw() {
    this.map.setCenter(new window.maptalks.Coordinate(this.map.getCenter()));
  }
  updateCoordsForRedraw() {
    for (let i = 0; i < this.objectsArr.length; i++) {
      this.updateCoordsForDraw(this.objectsArr[i]);
    }
    this.customRedraw();
  }
  updateCoordsForDraw(geoObj) {
    let obj3D;
    obj3D = geoObj.object3DHP;
    if (geoObj == null || obj3D == null || geoObj.marker == null) {
      return;
    }
    geoObj.coords.x += geoObj.speedX; // geographical coordinates
    geoObj.coords.y += geoObj.speedY; // geographical coordinates
    geoObj.marker.setCoordinates(new window.maptalks.Coordinate(geoObj.coords));
    const prevX = obj3D.position.x;
    const prevY = obj3D.position.y;
    const v = this.threeLayer.coordinateToVector3(geoObj.coords);
    obj3D.position.x = v.x;
    obj3D.position.y = v.y;
    obj3D.position.z = v.z;
    // obj3D.rotation.z = Math.atan2(prevY - obj3D.position.y, prevX - obj3D.position.x);
    // geoObj.boxHelper.update();
    if (geoObj.canMove === true) {
      obj3D.rotation.z = Math.atan2(prevY - obj3D.position.y, prevX - obj3D.position.x);
    }
    else {
      obj3D.rotation.z = geoObj.rotate || 0;
    }
  }
  //#endregion
  // detect when mouse under object
  //#region
  selectObjects() {
    this.setCanvasCursor('inherit');
    for (let i = 0; i < this.objectsArr.length; i++) {
      if (this.selectObject(this.objectsArr[i]) === true) {
        this.setCanvasCursor('pointer');
        return;
      }
    }
  }
  selectObject(geoObj) {
    let obj3D;
    obj3D = geoObj.object3DHP;
    if (obj3D == null || obj3D.visible === false) {
      geoObj.mouseUnder = false;
      return false;
    }
    const objects = [];
    obj3D.traverse((child) => {
      if (child instanceof window.THREE.Mesh) {
        objects.push(child);
      }
    });
    this.raycaster.setFromCamera(this.mouse, this.threeLayer.getCamera());
    const intersects = this.raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      return this.intersections(geoObj, obj3D);
    }
    if (intersects.length === 0) {
      return this.noIntersections(geoObj, obj3D);
    }
  }
  intersections(geoObj, obj3D) {
    const prevMouseUnderObject_2 = geoObj.mouseUnder;
    geoObj.mouseUnder = true;
    // on hover event
    if (prevMouseUnderObject_2 !== geoObj.mouseUnder) {
      if (geoObj.objectDivLabel) {
        geoObj.objectDivLabel.className = 'obj-label-selected';
      }
      if (this.on_hover_object != null) {
        const enableObjectEditMode = this.selectedForEditObject != null;
        this.on_hover_object(geoObj, enableObjectEditMode);
      }
    }
    // set selected color
    obj3D.traverse((child) => {
      if (!(child instanceof window.THREE.Mesh)) {
        return;
      }
      if (Array.isArray(child.material) === true) {
        return;
      }
      else {
        const initColor = child.material.initColor;
        child.material.color.setHex(initColor + 150);
      }
    });
    this.customRedraw();
    return true;
  }
  noIntersections(geoObj, obj3D) {
    const prevMouseUnderObject = geoObj.mouseUnder;
    geoObj.mouseUnder = false;
    // set default color
    obj3D.traverse((child) => {
      if (!(child instanceof window.THREE.Mesh)) {
        return;
      }
      if (Array.isArray(child.material) === true) {
        return;
      }
      else {
        const initColor = child.material.initColor;
        child.material.color.setHex(initColor);
      }
    });
    // event when mouse move and mouse leave 3d object
    if (prevMouseUnderObject !== geoObj.mouseUnder) {
      this.customRedraw();
      if (geoObj !== this.selectedObject) {
        if (geoObj.objectDivLabel) {
          geoObj.objectDivLabel.className = 'obj-label';
        }
      }
    }
    return false;
  }
  //#endregion
  setCanvasCursor(cursor) {
    this.canvasElem.style.cursor = cursor;
  }
  changeVisibleAndScale(geoObj) {
    if (this.mapZoomEnum === MapZoomEnum.BIG) {
      this.whenBigZoom(geoObj);
    }
    else if (this.mapZoomEnum === MapZoomEnum.SMALL) {
      this.whenSmallZoom(geoObj);
    }
    else {
      this.whenAvgZoom(geoObj);
    }
  }
  detectMapZoom(mapZoom) {
    if (mapZoom >= this.bigZoom + this.deltaZoom) {
      return MapZoomEnum.BIG;
    }
    else if (mapZoom < this.avgZoom + this.deltaZoom) {
      return MapZoomEnum.SMALL;
    }
    else {
      return MapZoomEnum.AVG;
    }
  }
  whenBigZoom(geoObj) {
    if (geoObj.objectDivLabel) {
      geoObj.objectDivLabel.style.display = 'block';
      if (this.selectedForEditObject !== geoObj) {
        geoObj.editBtnLabel.style.display = 'block';
      }
    }
    if (geoObj.object3DHP) {
      geoObj.object3DHP.visible = true;
    }
    if (geoObj.boxHelper) {
      geoObj.boxHelper.visible = true;
    }
  }
  whenAvgZoom(geoObj) {
    if (geoObj.objectDivLabel) {
      geoObj.objectDivLabel.style.display = 'none';
      geoObj.editBtnLabel.style.display = 'none';
    }
    if (geoObj.object3DHP) {
      geoObj.object3DHP.visible = true;
    }
    if (geoObj.boxHelper) {
      geoObj.boxHelper.visible = true;
    }
  }
  whenSmallZoom(geoObj) {
    if (geoObj.objectDivLabel) {
      geoObj.objectDivLabel.style.display = 'none';
      geoObj.editBtnLabel.style.display = 'none';
    }
    if (geoObj.object3DHP) {
      geoObj.object3DHP.visible = false;
    }
    if (geoObj.boxHelper) {
      geoObj.boxHelper.visible = false;
    }
  }
  // change object scale
  //#region
  deltaToScale(delta) {
    let res = 1;
    for (let i = 1; i < delta; i++) {
      res = 2 * res;
    }
    return res;
  }
  linearInterpolation(y0, y1, x0, x1, x) {
    if (Math.abs(x1 - x0) < 0.000000000001) {
      return y0;
    }
    return y0 + ((y1 - y0) / (x1 - x0)) * (x - x0);
  }
  calcScale(mapZoom) {
    let delta = 0;
    if (mapZoom === this.initZoom) {
      return 1;
    }
    else if (mapZoom > this.initZoom) {
      delta = mapZoom - this.initZoom + 1;
      return 1 / this.deltaToScale(delta);
    }
    else {
      delta = this.initZoom - mapZoom + 1;
      return this.deltaToScale(delta);
    }
  }
  calcInterpolationScale(mapZoom) {
    const x0 = Math.floor(mapZoom);
    const x1 = Math.ceil(mapZoom);
    const y0 = this.calcScale(x0);
    const y1 = this.calcScale(x1);
    return this.linearInterpolation(y0, y1, x0, x1, mapZoom);
  }
  //#endregion
  // edit mode
  //#region
  editChangeScale(scale) {
    const geoObject = this.selectedForEditObject;
    if (geoObject == null) {
      return;
    }
    geoObject.scale = scale;
    if (geoObject.object3DHP) {
      geoObject.object3DHP.scale.set(scale, scale, scale);
    }
    this.updateGeoObjectSettings(geoObject);
  }
  enableObjectDrag() {
    if (this.selectedForEditObject != null && this.mouseBtnClicked === true && this.selectedForEditObject.mouseUnder === true) {
      this.map.config('draggable', false);
      this.selectedForEditObject.objectDivLabel.style.display = 'none';
      this.selectedForEditObject.editPanelLabel.style.display = 'none';
      this.enabledObjectDrag = true;
    }
  }
  disableObjectDrag() {
    if (this.selectedForEditObject != null) {
      this.map.config('draggable', true);
      if (this.mapZoomEnum === MapZoomEnum.BIG) {
        this.selectedForEditObject.objectDivLabel.style.display = 'block';
      }
      this.selectedForEditObject.editPanelLabel.style.display = 'block';
      this.enabledObjectDrag = false;
    }
  }
  dragSelectedObject(x, y) {
    if (this.selectedForEditObject != null && this.mouseBtnClicked === true && this.enabledObjectDrag === true) {
      this.selectedForEditObject.coords.x = x;
      this.selectedForEditObject.coords.y = y;
      this.updateGeoObjectSettings(this.selectedForEditObject);
    }
  }
  //#endregion
  // drag and drop
  //#region
  drop(object3DAndProject, x, y) {
    const object3DDto = object3DAndProject.object3DDto;
    const project = object3DAndProject.project;
    object3DDto.staticPositionX = x;
    object3DDto.staticPositionY = y;
    object3DDto.scale = 1;
    object3DDto.rotate = 0;
    this.showProgressWhenDropObject$.next(true);
    this.mapService.post3DObject(object3DDto).subscribe((val) => {
      this.addNewObjectWhenDrop(object3DDto, val.objectId, project, this.when3DObjectLoaded);
      const projectGeoObjectDto = {
        projectId: project.id,
        projectUserId: AuthService.getUserId(),
        geoObjectId: val.objectId,
        path: object3DDto.path
      };
      this.projectsService.addProjectGeoObject(projectGeoObjectDto).subscribe();
      const historyPositionDto = {
        objectId: projectGeoObjectDto.geoObjectId,
        positionX: object3DDto.staticPositionX,
        positionY: object3DDto.staticPositionY,
        scale: object3DDto.scale,
        rotate: object3DDto.rotate
      };
      this.mapService.postHistoryData(historyPositionDto).subscribe();
    });
  }
  addNewObjectWhenDrop(object3DDto, object3DId, project, cbObjectLoaded) {
    const geoObject = this.object3DDtoToGeoObject(object3DDto, object3DId, project);
    this.mapAddNewObject(geoObject, cbObjectLoaded);
  }
}
