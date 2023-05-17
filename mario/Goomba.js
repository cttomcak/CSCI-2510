class GoombaControllerComponent extends Component {
  addGoomba(X, Y) {
    let goombaGameObject = new GoombaGameObject();
    GameObject.instantiate(goombaGameObject);

    goombaGameObject.transform.x = X;
    goombaGameObject.transform.y = Y;
  }
}

class GoombaGameObject extends GameObject {
  name = "GoombaGameObject";
  size = 16;
  start() {
    this.addComponent(new GoombaComponent());
    this.addComponent(new GoombaDrawComponent());
  }
}

class GoombaComponent extends Component {
  start() {
    this.speed = -20;
    this.vx = this.speed;
    this.vy = 0;
    this.gravity = 500;
    this.addListener(
      GameObject.getObjectByName("ScoreGameObject").getComponent(
        "ScoreComponent"
      )
    );
    this.inHole = null;
  }
  kill() {
    this.updateListeners("KillGoomba");
    this.parent.destroy();
  }
  update(ctx) {
    let WTG = Camera.worldToGUI(ctx, this.transform.x, this.transform.y);

    if (WTG.x > EngineGlobals.logicalWidth + 64) {
      return;
    }

    let groundGameObject = GameObject.getObjectByName("GroundGameObject");
    let groundComponent = groundGameObject.getComponent("GroundComponent");
    let groundLevel = groundComponent.y;

    this.onSurface = false;

    let nextX = this.transform.x + this.vx * Time.deltaTime;
    let nextY = this.transform.y + this.vy * Time.deltaTime;

    if (!this.inHole) {
      let holeGameObjects = GameObject.getObjectsByName("HoleGameObject");
      for (let holeGameObject of holeGameObjects) {
        let holeX = holeGameObject.transform.x;
        let holeSize = holeGameObject.size;
        if (
          nextX > holeX &&
          nextX + this.parent.size < holeX + holeSize &&
          nextY >= groundLevel
        ) {
          this.inHole = holeGameObject;
          this.onSurface = false;
        }
      }
    } else {
      let holeX = this.inHole.transform.x;
      let holeSize = this.inHole.size;
      if (nextX < holeX) {
        this.vx = 0;
        nextX = holeX;
      } else if (nextX + this.parent.size > holeX + holeSize) {
        this.vx = 0;
        nextX = holeX + holeSize - this.parent.size;
      }
      if (nextY > 1000) {
        this.parent.destroy();
      }
    }

    if (nextY >= groundLevel && !this.inHole) {
      this.onSurface = true;
      this.vy = 0;
      nextY = groundLevel;
    }

    let koopaGameObjects = GameObject.getObjectsByName("KoopaGameObject");

    for (let koopaGameObject of koopaGameObjects) {
      if (Math.abs(koopaGameObject.transform.x - nextX) < 32) {
        let koopaComponent = koopaGameObject.getComponent("KoopaComponent");
        let koopaX = koopaGameObject.transform.x;
        let koopaY = koopaGameObject.transform.y;
        let koopaWidth = koopaGameObject.width;
        let koopaHeight = koopaGameObject.height;

        if (
          nextX < koopaX + koopaWidth &&
          koopaX < nextX + this.parent.size &&
          nextY > koopaY - koopaHeight &&
          koopaY > nextY - this.parent.size
        ) {
          if (!koopaComponent.inShell) {
            this.parent.destroy();
          } else {
            this.vx = -this.vx;
          }
        }
      }
    }

    let goombaGameObjects = GameObject.getObjectsByName("GoombaGameObject");

    for (let goombaGameObject of goombaGameObjects) {
      if (
        Math.abs(goombaGameObject.transform.x - nextX) < 32 &&
        this.parent != goombaGameObject
      ) {
        let goombaX = goombaGameObject.transform.x;
        let goombaY = goombaGameObject.transform.y;
        let goombaSize = goombaGameObject.size;

        if (
          !(
            nextX > goombaX + goombaSize ||
            goombaX > nextX + this.parent.size ||
            nextY < goombaY - goombaSize ||
            goombaY < nextY - this.parent.size
          )
        ) {
          this.vx = -this.vx;
        }
      }
    }

    let pipeGameObjects = GameObject.getObjectsByName("PipeGameObject");

    for (let pipeGameObject of pipeGameObjects) {
      if (Math.abs(pipeGameObject.transform.x - nextX) < 64) {
        let pipeX = pipeGameObject.transform.x;
        let pipeY = pipeGameObject.transform.y;
        let pipeWidth = pipeGameObject.width;
        let pipeHeight = pipeGameObject.height;

        if (
          nextX < pipeX + pipeWidth &&
          pipeX < nextX + this.parent.size &&
          nextY > pipeY - pipeHeight &&
          pipeY >= nextY - this.parent.size
        ) {
          if (this.transform.y <= pipeY - pipeHeight) {
            this.vy = 0;
            nextY = pipeY - pipeHeight;
            this.onSurface = true;
          } else if (this.transform.x + this.parent.size <= pipeX) {
            this.vx = -this.vx;
            nextX = pipeX - this.parent.size;
          } else if (this.transform.x >= pipeX + pipeWidth) {
            this.vx = -this.vx;
            nextX = pipeX + pipeWidth;
          }
        }
      }
    }

    this.transform.x = nextX;
    this.transform.y = nextY;

    if (!this.onSurface) {
      this.vy += this.gravity * Time.deltaTime;
    }
  }
}

class GoombaDrawComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "#994e00";
    ctx.fillRect(
      this.transform.x,
      this.transform.y,
      this.parent.size,
      -this.parent.size
    );
  }
}

window.GoombaControllerComponent = GoombaControllerComponent;
