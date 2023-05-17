class PipeControllerComponent extends Component {
  addPipe(X, Y, height) {
    let pipeGameObject = new PipeGameObject();
    GameObject.instantiate(pipeGameObject);

    pipeGameObject.transform.x = X;
    pipeGameObject.transform.y = Y;
    pipeGameObject.height = height;
  }
}

class PipeGameObject extends GameObject {
  name = "PipeGameObject";
  height = 48;
  width = 28;
  start() {
    this.addComponent(new PipeComponent());
  }
}

class PipeComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "#88D800";
    ctx.fillRect(
      this.transform.x,
      this.transform.y,
      this.parent.width,
      -this.parent.height
    );
    ctx.fillStyle = "#0D9300";
    ctx.fillRect(
      this.transform.x - 1,
      this.transform.y - this.parent.height + 16,
      this.parent.width + 2,
      -16
    );
  }
}

window.PipeControllerComponent = PipeControllerComponent;
