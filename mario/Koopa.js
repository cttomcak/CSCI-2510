class KoopaControllerComponent extends Component {
  addKoopa(X, Y) {
    let koopaGameObject = new KoopaGameObject();
    GameObject.instantiate(koopaGameObject);

    koopaGameObject.transform.x = X;
    koopaGameObject.transform.y = Y;
  }
}

class KoopaGameObject extends GameObject {
  name = "KoopaGameObject";
  width = 16;
  height = 28;
  start() {
    this.addComponent(new KoopaComponent());
    this.addComponent(new KoopaDrawComponent());
  }
}

class KoopaComponent extends Component {
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
    this.inShell = false;
  }
  hit(centerX) {
    if (!this.inShell) {
      this.inShell = true;
      this.parent.height = 16;
      this.vx = 0;
    } else this.kickShell(centerX);
    this.updateListeners("HitKoopa");
  }
  kickShell(centerX) {
    if (this.inShell) {
      if (centerX > this.transform.x + this.parent.width / 2) {
        this.vx = -300;
      } else {
        this.vx = 300;
      }
      this.inShell = false;
      return true;
    } else {
      return false;
    }
  }
  kill() {
    this.updateListeners("HitKoopa");
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
          nextX + this.parent.width < holeX + holeSize &&
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
      } else if (nextX + this.parent.width > holeX + holeSize) {
        this.vx = -this.vx;
        nextX = holeX + holeSize - this.parent.width;
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

    let goombaGameObjects = GameObject.getObjectsByName("GoombaGameObject");

    for (let goombaGameObject of goombaGameObjects) {
      if (Math.abs(goombaGameObject.transform.x - nextX) < 32) {
        let goombaX = goombaGameObject.transform.x;
        let goombaY = goombaGameObject.transform.y;
        let goombaSize = goombaGameObject.size;

        if (
          !(
            nextX > goombaX + goombaSize ||
            goombaX > nextX + this.parent.width ||
            nextY < goombaY - goombaSize ||
            goombaY < nextY - this.parent.height
          )
        ) {
          if (this.inShell) {
            this.vx = -this.vx;
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

class KoopaDrawComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "#00b32c";
    ctx.fillRect(
      this.transform.x,
      this.transform.y,
      this.parent.width,
      -this.parent.height
    );
  }
}

window.KoopaControllerComponent = KoopaControllerComponent;
