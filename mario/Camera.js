class CameraControllerComponent extends Component {
  start() {
    Camera.main.fillStyle = "#9290FF";

    let marioTrackerGameObject = new GameObject("MarioTrackerGameObject");
    marioTrackerGameObject.addComponent(new MarioTrackerComponent());
    GameObject.instantiate(marioTrackerGameObject);
  }
  update() {
    let tracker;
    tracker = GameObject.getObjectByName("MarioTrackerGameObject");
    if (!tracker) {
      return;
    }
    Camera.main.transform.x = tracker.transform.x;
  }
}

class MarioTrackerComponent extends Component {
  update() {
    let marioGameObject = GameObject.getObjectByName("MarioGameObject");
    if (!marioGameObject) {
      return;
    }
    let maxDifference = 16;
    let difference = marioGameObject.transform.x - this.transform.x;
    if (difference > maxDifference) {
      this.transform.x += difference - maxDifference;
    }
  }
}

window.CameraControllerComponent = CameraControllerComponent;
