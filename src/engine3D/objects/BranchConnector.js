import BABYLON from 'babylonjs';
import _ from 'lodash';
import Abstract3DObject from './Abstract3DObject';

const config = {
  radius: 2,
  tessellation: 16,
  curveFactor: 20,
  subdivisions: 40,
  cap: BABYLON.Mesh.CAP_ALL,
  sideOrientation: BABYLON.Mesh.FRONTSIDE,
  enlogatingSpeed: 1,
  addOperation: 'ADD',
  removeOperation: 'REMOVE'
};

export default class BranchConnector extends Abstract3DObject {
  constructor (name, startPosition, endPosition, scene, endEvent, renderTextureMaterial) {
    super(name, scene);
    this._createPath = ::this._createPath;
    this._createMesh = ::this._createMesh;
    this._animate = ::this._animate;

    this.startPosition = startPosition.clone();
    this.endPosition = endPosition.clone();
    this.path = this._createPath();
    this.mesh = this._createMesh(this.name, this.path, null);
    this.mesh.renderTextureMaterial = renderTextureMaterial;
    this._animate(endEvent);
  }

  _animate (endEvent) {
    // TODO make separate class for animation
    var index = 1;
    var elongating = () => {
      var newPath = this.path.slice(0, index);
      var pathEnd = _.fill(Array(this.path.length - index), _.last(newPath));
      newPath = _.concat(newPath, pathEnd);
      this.mesh = this._createMesh(null, newPath, this.mesh);
      index += config.enlogatingSpeed;
      if (index - 1 >= this.path.length) {
        this.scene.unregisterBeforeRender(elongating);
        if (endEvent) {
          endEvent();
        }
      }
    };

    this.scene.registerBeforeRender(elongating);
  }

  _createPath () {
    var point1 = this.startPosition.clone();
    point1.z = this.endPosition.z;
    var point2 = this.startPosition.clone();
    point2.x = this.endPosition.x;

    var bezier = BABYLON.Curve3.CreateCubicBezier(this.startPosition, point1, point2,
      this.endPosition, config.subdivisions);
    return bezier.getPoints();
  }

  _createMesh (name, path, instance) {
    var { radius, tessellation, cap, sideOrientation } = config;
    return BABYLON.Mesh.CreateTube(name, path, radius, tessellation, null, cap,
      this.scene, true, sideOrientation, instance);
  }
}
