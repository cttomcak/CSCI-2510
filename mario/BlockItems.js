class MushroomGameObject extends GameObject {
  name = "MushroomGameObject";
  start() {
    this.addComponent(new MushroomComponent());
    this.addComponent(new MoveItemComponent());
  }
}

class MushroomComponent extends Component {
  start() {
    this.size = 16;
  }
  gotGot() {
    this.parent.destroy();
  }
  draw(ctx) {
    ctx.fillStyle = "#EA9E22";
    ctx.fillRect(
      this.transform.x,
      this.transform.y - this.size / 2,
      this.size,
      -this.size / 2
    );
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(
      this.transform.x + this.size / 4,
      this.transform.y,
      this.size / 2,
      -this.size / 2
    );
  }
}

class CoinGameObject extends GameObject {
  name = "CoinGameObject";
  start() {
    this.addComponent(new CoinComponent());
    this.addComponent(new CircleComponent("gold"));
    this.transform.sx = 7;
    this.transform.sy = 7;
  }
}

class CoinComponent extends Component {
  start() {
    this.timeTillDeath = 0.25;
    GameObject.getObjectByName("CoinTextGameObject")
      .getComponent("CoinTextComponent")
      .addCoin();
  }
  update() {
    this.timeTillDeath -= Time.deltaTime;
    if (this.timeTillDeath <= 0) {
      this.parent.destroy();
    }
    this.transform.y -= 2;
  }
}

class CircleComponent extends Component {
  constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1) {
    super();
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }
  draw(ctx) {
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.arc(
      this.transform.x,
      this.transform.y,
      this.transform.sx,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
  }
}

class StarGameObject extends GameObject {
  name = "StarGameObject";
  start() {
    this.addComponent(new StarComponent());
    this.addComponent(new MoveItemComponent());
  }
}

class StarComponent extends Component {
  start() {
    this.size = 16;
  }
  gotGot() {
    this.parent.destroy();
  }
  draw(ctx) {
    ctx.fillStyle = "#20edfc";
    ctx.fillRect(
      this.transform.x + 2,
      this.transform.y - 2,
      this.size - 4,
      -this.size + 4
    );
  }
}

class MoveItemComponent extends Component {
  start() {
    this.vx = 40;
    this.vy = -150;
    this.gravity = 800;
    this.inHole = false;
    this.size = 16;
  }
  update() {
    if (!this.started) {
      return;
    }

    let groundGameObject = GameObject.getObjectByName("GroundGameObject");
    if (!groundGameObject) {
      return;
    }
    let groundComponent = groundGameObject.getComponent("GroundComponent");
    let groundLevel = groundComponent.y;

    this.onSurface = false;

    this.x = this.transform.x;
    this.y = this.transform.y;

    let nextX = this.x + this.vx * Time.deltaTime;
    let nextY = this.y + this.vy * Time.deltaTime;

    if (!this.inHole) {
      let holeGameObjects = GameObject.getObjectsByName("HoleGameObject");
      for (let holeGameObject of holeGameObjects) {
        let holeX = holeGameObject.transform.x;
        let holeSize = holeGameObject.size;
        if (
          nextX > holeX &&
          nextX + this.size < holeX + holeSize &&
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
      } else if (nextX + this.size > holeX + holeSize) {
        this.vx = 0;
        nextX = holeX + holeSize - this.size;
      }
      if (nextY > 500) {
        this.parent.destroy();
      }
    }

    if (nextY >= groundLevel && !this.inHole) {
      this.onSurface = true;
      this.vy = 0;
      nextY = groundLevel;
    }

    let questionBlockGameObjects = GameObject.getObjectsByName(
      "QuestionBlockGameObject"
    );

    for (let questionBlockGameObject of questionBlockGameObjects) {
      if (Math.abs(questionBlockGameObject.transform.x - nextX) < 32) {
        let questionBlockComponent = questionBlockGameObject.getComponent(
          "QuestionBlockComponent"
        );
        let questionBlockX = questionBlockGameObject.transform.x;
        let questionBlockY = questionBlockGameObject.transform.y;
        let questionBlockSize = questionBlockComponent.size;

        if (
          nextX < questionBlockX + questionBlockSize &&
          questionBlockX < nextX + this.size &&
          nextY > questionBlockY - questionBlockSize &&
          questionBlockY >= nextY - this.size
        ) {
          if (this.y <= questionBlockY - questionBlockSize) {
            this.vy = 0;
            nextY = questionBlockY - questionBlockSize;
            this.onSurface = true;
          } else if (this.x + this.size <= questionBlockX) {
            this.vx = -this.vx;
            nextX = questionBlockX - this.size;
          } else if (this.x >= questionBlockX + questionBlockSize) {
            this.vx = -this.vx;
            nextX = questionBlockX + questionBlockSize;
          }
        }
      }
    }

    let brickBlockGameObjects = GameObject.getObjectsByName(
      "BrickBlockGameObject"
    );

    for (let brickBlockGameObject of brickBlockGameObjects) {
      if (Math.abs(brickBlockGameObject.transform.x - nextX) < 32) {
        let brickBlockComponent = brickBlockGameObject.getComponent(
          "BrickBlockComponent"
        );
        let brickBlockX = brickBlockGameObject.transform.x;
        let brickBlockY = brickBlockGameObject.transform.y;
        let brickBlockSize = brickBlockComponent.size;

        if (
          nextX < brickBlockX + brickBlockSize &&
          brickBlockX < nextX + this.size &&
          nextY > brickBlockY - brickBlockSize &&
          brickBlockY >= nextY - this.size
        ) {
          if (this.y <= brickBlockY - brickBlockSize) {
            this.vy = 0;
            nextY = brickBlockY - brickBlockSize;
            this.onSurface = true;
          } else if (this.x + this.size <= brickBlockX) {
            this.vx = -this.vx;
            nextX = brickBlockX - this.size;
          } else if (this.x >= brickBlockX + brickBlockSize) {
            this.vx = -this.vx;
            nextX = brickBlockX + brickBlockSize;
          }
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
          pipeX < nextX + this.size &&
          nextY > pipeY - pipeHeight &&
          pipeY >= nextY - this.size
        ) {
          if (this.y <= pipeY - pipeHeight) {
            this.vy = 0;
            nextY = pipeY - pipeHeight;
            this.onSurface = true;
          } else if (this.x + this.size <= pipeX) {
            this.vx = -this.vx;
            nextX = pipeX - this.size;
          } else if (this.x >= pipeX + pipeWidth) {
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

class FireFlowerGameObject extends GameObject {
  name = "FireFlowerGameObject";
  start() {
    this.addComponent(new FireFlowerComponent());
  }
}

class FireFlowerComponent extends Component {
  start() {
    this.size = 16;
  }
  gotGot() {
    this.parent.destroy();
  }
  draw(ctx) {
    ctx.fillStyle = "#E23F1B";
    ctx.fillRect(
      this.transform.x,
      this.transform.y - this.size / 3,
      this.size,
      (-this.size * 2) / 3
    );
    ctx.fillStyle = "#F8EC41";
    ctx.fillRect(
      this.transform.x + 3,
      this.transform.y - this.size / 3 - 3,
      this.size - 6,
      (-this.size * 2) / 3 + 6
    );
    ctx.fillStyle = "#8CE240";
    ctx.fillRect(
      this.transform.x + 5,
      this.transform.y,
      this.size - 10,
      -this.size / 3
    );
  }
}

window.MushroomGameObject = MushroomGameObject;
window.CoinGameObject = CoinGameObject;
window.StarGameObject = StarGameObject;
window.FireFlowerGameObject = FireFlowerGameObject;
