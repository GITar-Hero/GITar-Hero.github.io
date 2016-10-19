import BABYLON from 'babylonjs';
import config from './config';
import Scene from './Scene';

class Engine3D extends BABYLON.Engine {
  constructor(canvas) {
    super(canvas, config.ANTIALIASING);
    this.scene = new Scene(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.renderLoop();
  }

  renderLoop(){
    let scene = this.scene;
    this.runRenderLoop(function() {
      scene.render();
    });
  }

  onStateChange(){
    console.log("Engine3D::onStageChange");
  }
}

export default Engine3D;
