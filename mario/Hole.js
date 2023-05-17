class HoleControllerComponent extends Component {
  addHole(X, size) {
    let holeGameObject = new HoleGameObject();
    GameObject.instantiate(holeGameObject);

    holeGameObject.transform.x = X;
    holeGameObject.size = size;
  }
}

class HoleGameObject extends GameObject {
  name = "HoleGameObject";
  size = 0;
  start() {
    this.addComponent(new HoleComponent());
  }
}

class HoleComponent extends Component {
  start() {
    this.size = this.parent.size;
  }
  draw(ctx) {
    let groundGameObject = GameObject.getObjectByName("GroundGameObject");
    let groundComponent = groundGameObject.getComponent("GroundComponent");
    let groundLevel = groundComponent.y;
    ctx.fillStyle = "#9290FF";
    ctx.fillRect(this.transform.x, groundLevel - 4, this.size, 48 + 4);
  }
}

window.HoleControllerComponent = HoleControllerComponent;
