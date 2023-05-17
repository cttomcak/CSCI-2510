class MarioGameObject extends GameObject {
  name = "MarioGameObject";
  start() {
    this.addComponent(new MarioComponent());
    this.addComponent(new MarioDrawComponent());
  }
}

class MarioComponent extends Component {
  start() {
    let groundGameObject = GameObject.getObjectByName("GroundGameObject");
    let groundComponent = groundGameObject.getComponent("GroundComponent");
    let groundLevel = groundComponent.y;
    this.transform.x = 128;
    this.transform.y = groundLevel;
    this.vx = 0;
    this.vy = 0;
    this.onSurface = true;
    this.gravity = 800;
    this.acceleration = 400;
    this.jumpVelocity = -375;
    this.maxSpeed = 200;
    this.width = 14;
    this.height = 16;
    this.starTime = 0;
    this.inHole = null;
    this.IFrames = 0;
    this.isDead = false;
    this.firePower = false;
    this.direction = "right";
    this.fireBallCooldown = 0;
  }
  update(ctx) {
    if (this.isDead) {
      this.vx = 0;
      this.vy += this.gravity * Time.deltaTime;
      this.transform.y += this.vy * Time.deltaTime;
      if (this.transform.y > 500) {
        SceneManager.changeScene(1);
      }
      return;
    }

    let groundGameObject = GameObject.getObjectByName("GroundGameObject");
    if (!groundGameObject) {
      return;
    }
    let groundComponent = groundGameObject.getComponent("GroundComponent");
    let groundLevel = groundComponent.y;

    let worldCoords = Camera.GUIToWorld(ctx, 0, 0);
    let leftBarrier = worldCoords.x;

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
          nextX + this.width < holeX + holeSize &&
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
      } else if (nextX + this.width > holeX + holeSize) {
        this.vx = 0;
        nextX = holeX + holeSize - this.width;
      }
      if (nextY > 500) {
        SceneManager.changeScene(1);
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
          questionBlockX < nextX + this.width &&
          nextY > questionBlockY - questionBlockSize &&
          questionBlockY >= nextY - this.height
        ) {
          if (this.transform.y - this.height >= questionBlockY) {
            this.vy = 0;
            nextY = questionBlockY + this.height;
            questionBlockComponent.spawnItem(this.height);
          } else if (this.transform.y <= questionBlockY - questionBlockSize) {
            this.vy = 0;
            nextY = questionBlockY - questionBlockSize;
            this.onSurface = true;
          } else if (this.transform.x + this.width <= questionBlockX) {
            this.vx = 0;
            nextX = questionBlockX - this.width;
          } else if (this.transform.x >= questionBlockX + questionBlockSize) {
            this.vx = 0;
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
          brickBlockX < nextX + this.width &&
          nextY > brickBlockY - brickBlockSize &&
          brickBlockY >= nextY - this.height
        ) {
          if (this.transform.y - this.height >= brickBlockY) {
            this.vy = 0;
            nextY = brickBlockY + this.height;
            brickBlockComponent.gotGot(this.height);
          } else if (this.transform.y <= brickBlockY - brickBlockSize) {
            this.vy = 0;
            nextY = brickBlockY - brickBlockSize;
            this.onSurface = true;
          } else if (this.transform.x + this.width <= brickBlockX) {
            this.vx = 0;
            nextX = brickBlockX - this.width;
          } else if (this.transform.x >= brickBlockX + brickBlockSize) {
            this.vx = 0;
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
          pipeX < nextX + this.width &&
          nextY > pipeY - pipeHeight &&
          pipeY >= nextY - this.height
        ) {
          if (this.transform.y - this.height >= pipeY) {
            this.vy = 0;
            nextY = pipeY + this.height;
          } else if (this.transform.y <= pipeY - pipeHeight) {
            this.vy = 0;
            nextY = pipeY - pipeHeight;
            this.onSurface = true;
          } else if (this.transform.x + this.width <= pipeX) {
            this.vx = 0;
            nextX = pipeX - this.width;
          } else if (this.transform.x >= pipeX + pipeWidth) {
            this.vx = 0;
            nextX = pipeX + pipeWidth;
          }
        }
      }
    }

    let poleGameObject = GameObject.getObjectByName("PoleGameObject");
    let poleDistance = poleGameObject.transform.x;

    if (this.transform.x + this.width > poleDistance) {
      this.transform.x = poleDistance - this.width;
      SceneManager.changeScene(2);
    }

    if (this.IFrames <= 0) {
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
            koopaX < nextX + this.width &&
            nextY > koopaY - koopaHeight &&
            koopaY > nextY - this.height
          ) {
            if (this.starTime > 0) {
              koopaComponent.kill();
            } else if (this.transform.y - this.height >= koopaY) {
              this.takeHit();
            } else if (this.transform.y <= koopaY - koopaHeight) {
              koopaComponent.hit(nextX + this.width / 2);
              nextY = koopaY - koopaHeight;
              this.vy = -200;
            } else {
              if (!koopaComponent.kickShell(nextX + this.width / 2)) {
                this.takeHit();
              }
              if (nextX < koopaX) {
                nextX = koopaX - this.width;
              } else {
                nextX = koopaX + koopaWidth;
              }
            }
          }
        }
      }

      let goombaGameObjects = GameObject.getObjectsByName("GoombaGameObject");

      for (let goombaGameObject of goombaGameObjects) {
        if (Math.abs(goombaGameObject.transform.x - nextX) < 32) {
          let goombaComponent =
            goombaGameObject.getComponent("GoombaComponent");
          let goombaX = goombaGameObject.transform.x;
          let goombaY = goombaGameObject.transform.y;
          let goombaSize = goombaGameObject.size;

          if (
            !(
              nextX > goombaX + goombaSize ||
              goombaX > nextX + this.width ||
              nextY < goombaY - goombaSize ||
              goombaY < nextY - this.height
            )
          ) {
            if (this.starTime > 0) {
              goombaComponent.kill();
            } else if (this.transform.y <= goombaY - goombaSize) {
              goombaComponent.kill();
              this.vy = -200;
            } else {
              this.takeHit();
            }
          }
        }
      }
    }

    let mushroomGameObjects = GameObject.getObjectsByName("MushroomGameObject");

    for (let mushroomGameObject of mushroomGameObjects) {
      if (Math.abs(mushroomGameObject.transform.x - nextX) < 32) {
        let mushroomComponent =
          mushroomGameObject.getComponent("MushroomComponent");
        let mushroomX = mushroomGameObject.transform.x;
        let mushroomY = mushroomGameObject.transform.y;
        let mushroomSize = mushroomComponent.size;

        if (
          !(
            nextX > mushroomX + mushroomSize ||
            mushroomX > nextX + this.width ||
            nextY < mushroomY - mushroomSize ||
            mushroomY < nextY - this.height
          )
        ) {
          if (this.height != 30) {
            this.height = 30;
            this.width = 14;
          }
          mushroomComponent.gotGot();
        }
      }
    }

    let fireFlowerGameObjects = GameObject.getObjectsByName(
      "FireFlowerGameObject"
    );

    for (let fireFlowerGameObject of fireFlowerGameObjects) {
      if (Math.abs(fireFlowerGameObject.transform.x - nextX) < 32) {
        let fireFlowerComponent = fireFlowerGameObject.getComponent(
          "FireFlowerComponent"
        );
        let fireFlowerX = fireFlowerGameObject.transform.x;
        let fireFlowerY = fireFlowerGameObject.transform.y;
        let fireFlowerSize = fireFlowerComponent.size;

        if (
          !(
            nextX > fireFlowerX + fireFlowerSize ||
            fireFlowerX > nextX + this.width ||
            nextY < fireFlowerY - fireFlowerSize ||
            fireFlowerY < nextY - this.height
          )
        ) {
          if (this.height != 30) {
            this.height = 30;
            this.width = 14;
          }
          this.firePower = true;
          fireFlowerComponent.gotGot();
        }
      }
    }

    let starGameObjects = GameObject.getObjectsByName("StarGameObject");

    for (let starGameObject of starGameObjects) {
      if (Math.abs(starGameObject.transform.x - nextX) < 32) {
        let starComponent = starGameObject.getComponent("StarComponent");
        let starX = starGameObject.transform.x;
        let starY = starGameObject.transform.y;
        let starSize = starComponent.size;

        if (
          !(
            nextX > starX + starSize ||
            starX > nextX + this.width ||
            nextY < starY - starSize ||
            starY < nextY - this.height
          )
        ) {
          this.starTime = 10;
          starComponent.gotGot();
        }
      }
    }

    if (this.starTime > 0) {
      this.starTime -= Time.deltaTime;
    }

    if (this.IFrames > 0) {
      this.IFrames -= Time.deltaTime;
    }

    if (nextX < leftBarrier && this.transform.x >= leftBarrier) {
      this.vx = 0;
      nextX = leftBarrier;
    }

    this.transform.x = nextX;
    this.transform.y = nextY;

    if (keysDown["ArrowLeft"]) {
      this.direction = "left";
      this.vx -= this.acceleration * Time.deltaTime;
    }
    if (keysDown["ArrowRight"]) {
      this.direction = "right";
      this.vx += this.acceleration * Time.deltaTime;
    }
    if (Math.abs(this.vx) > this.maxSpeed) {
      this.vx = Math.sign(this.vx) * this.maxSpeed;
    }
    if (!keysDown["ArrowLeft"] && !keysDown["ArrowRight"]) {
      if (this.vx > 0) {
        if (this.onSurface) {
          this.vx -= Math.sign(this.vx) * this.acceleration * Time.deltaTime;
        } else {
          this.vx -=
            ((Math.sign(this.vx) * this.acceleration) / 2) * Time.deltaTime;
        }
        if (this.vx < 0) {
          this.vx = 0;
        }
      } else if (this.vx < 0) {
        if (this.onSurface) {
          this.vx -= Math.sign(this.vx) * this.acceleration * Time.deltaTime;
        } else {
          this.vx -=
            ((Math.sign(this.vx) * this.acceleration) / 2) * Time.deltaTime;
        }
        if (this.vx > 0) {
          this.vx = 0;
        }
      }
    }
    if (this.onSurface && keysDown["ArrowUp"]) {
      this.vy = this.jumpVelocity;
      this.onSurface = false;
    }
    if (!this.onSurface) {
      this.vy += this.gravity * Time.deltaTime;
    }

    if (this.fireBallCooldown > 0) {
      this.fireBallCooldown -= Time.deltaTime;
    }

    if (keysDown["a"] && this.firePower && this.fireBallCooldown <= 0) {
      let fireBallGameObject = new FireBallGameObject();
      fireBallGameObject.transform.x = this.transform.x;
      fireBallGameObject.transform.y = this.transform.y - this.height / 2;
      fireBallGameObject.direction = this.direction;
      GameObject.instantiate(fireBallGameObject);
      this.fireBallCooldown = 0.2;
    }
  }
  takeHit() {
    if (this.height == 16) {
      this.isDead = true;
      this.vy = -250;
    } else {
      this.height = 16;
      this.width = 14;
      this.IFrames = 1;
      this.firePower = false;
    }
  }
}

class MarioDrawComponent extends Component {
  draw(ctx) {
    let mario = this.parent.getComponent("MarioComponent");
    let starTime = mario.starTime;
    let width = mario.width;
    let height = mario.height;
    let IFrames = mario.IFrames;
    let firePower = mario.firePower;

    if (starTime > 0) {
      if (Time.frameCount % 18 < 3) {
        ctx.fillStyle = "#fc2557";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#03daa8";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      } else if (Time.frameCount % 18 < 6) {
        ctx.fillStyle = "#fc793c";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#0386c3";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      } else if (Time.frameCount % 18 < 9) {
        ctx.fillStyle = "#8afc07";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#7503f8";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      } else if (Time.frameCount % 18 < 12) {
        ctx.fillStyle = "#07fcd7";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#f80328";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      } else if (Time.frameCount % 18 < 15) {
        ctx.fillStyle = "#071bfc";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#f8e403";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      } else if (Time.frameCount % 18 < 18) {
        ctx.fillStyle = "#fc07e3";
        ctx.fillRect(this.transform.x, this.transform.y, width, -height);
        ctx.fillStyle = "#03f81c";
        ctx.fillRect(
          this.transform.x,
          this.transform.y - height / 1.8,
          width,
          -height / 3
        );
      }
      return;
    } else if (IFrames > 0) {
      if (Time.frameCount % 10 > 5) {
        return;
      }
    }

    if (firePower) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.transform.x, this.transform.y, width, -height);
      ctx.fillStyle = "#fb9a39";
      ctx.fillRect(
        this.transform.x,
        this.transform.y - height / 1.8,
        width,
        -height / 3
      );
      ctx.fillStyle = "white";
      ctx.fillRect(this.transform.x, this.transform.y, width, -height / 6);
      ctx.fillRect(
        this.transform.x,
        this.transform.y - height / 1.2,
        width,
        -height / 6
      );
      return;
    }

    ctx.fillStyle = "#db2800";
    ctx.fillRect(this.transform.x, this.transform.y, width, -height);
    ctx.fillStyle = "#fb9a39";
    ctx.fillRect(
      this.transform.x,
      this.transform.y - height / 1.8,
      width,
      -height / 3
    );
    ctx.fillStyle = "#877000";
    ctx.fillRect(this.transform.x, this.transform.y, width, -height / 6);
  }
}

class FireBallGameObject extends GameObject {
  name = "FireBallGameObject";
  direction;
  start() {
    this.addComponent(new FireBallComponent());
    this.addComponent(new FireBallDrawComponent());
  }
}

class FireBallDrawComponent extends Component {
  draw(ctx) {
    let size = this.parent.getComponent("FireBallComponent").size;
    ctx.fillStyle = "#ff8000";
    ctx.fillRect(this.transform.x, this.transform.y, size, -size);
  }
}

class FireBallComponent extends Component {
  start() {
    this.size = 8;
    this.timeTillDeath = 1.5;
    if (this.parent.direction == "right") {
      this.vx = 300;
    } else {
      this.vx = -300;
    }
    this.vy = 0;
    this.gravity = 800;
    this.inHole = false;
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

    let nextX = this.transform.x + this.vx * Time.deltaTime;
    let nextY = this.transform.y + this.vy * Time.deltaTime;

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
        this.vx = -this.vx;
        nextX = holeX;
      } else if (nextX + this.size > holeX + holeSize) {
        this.vx = -this.vx;
        nextX = holeX + holeSize - this.size;
      }
    }

    if (nextY >= groundLevel && !this.inHole) {
      this.onSurface = true;
      this.vy = -150;
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
          if (this.transform.y - this.size >= questionBlockY) {
            this.vy = -this.vy;
            nextY = questionBlockY + this.size;
          } else if (this.transform.y <= questionBlockY - questionBlockSize) {
            this.vy = -150;
            nextY = questionBlockY - questionBlockSize;
            this.onSurface = true;
          } else if (this.transform.x + this.size <= questionBlockX) {
            this.vx = -this.vx;
            nextX = questionBlockX - this.size;
          } else if (this.transform.x >= questionBlockX + questionBlockSize) {
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
          if (this.transform.y - this.size >= brickBlockY) {
            this.vy = -this.vy;
            nextY = brickBlockY + this.size;
          } else if (this.transform.y <= brickBlockY - brickBlockSize) {
            this.vy = -150;
            nextY = brickBlockY - brickBlockSize;
            this.onSurface = true;
          } else if (this.transform.x + this.size <= brickBlockX) {
            this.vx = -this.vx;
            nextX = brickBlockX - this.size;
          } else if (this.transform.x >= brickBlockX + brickBlockSize) {
            this.vx = -this.vx;
            nextX = brickBlockX + brickBlockSize;
          }
        }
      }
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
          koopaX < nextX + this.size &&
          nextY > koopaY - koopaHeight &&
          koopaY > nextY - this.size
        ) {
          koopaComponent.kill();
          this.parent.destroy();
        }
      }
    }

    let goombaGameObjects = GameObject.getObjectsByName("GoombaGameObject");

    for (let goombaGameObject of goombaGameObjects) {
      if (Math.abs(goombaGameObject.transform.x - nextX) < 32) {
        let goombaComponent = goombaGameObject.getComponent("GoombaComponent");
        let goombaX = goombaGameObject.transform.x;
        let goombaY = goombaGameObject.transform.y;
        let goombaSize = goombaGameObject.size;

        if (
          !(
            nextX > goombaX + goombaSize ||
            goombaX > nextX + this.size ||
            nextY < goombaY - goombaSize ||
            goombaY < nextY - this.size
          )
        ) {
          goombaComponent.kill();
          this.parent.destroy();
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
          if (this.transform.y - this.size >= pipeY) {
            this.vy = 0;
            nextY = pipeY + this.size;
          } else if (this.transform.y <= pipeY - pipeHeight) {
            this.vy = -150;
            nextY = pipeY - pipeHeight;
            this.onSurface = true;
          } else if (this.transform.x + this.size <= pipeX) {
            this.vx = -this.vx;
            nextX = pipeX - this.size;
          } else if (this.transform.x >= pipeX + pipeWidth) {
            this.vx = -this.vx;
            nextX = pipeX + pipeWidth;
          }
        }
      }
    }

    if (this.timeTillDeath > 0) {
      this.timeTillDeath -= Time.deltaTime;
    } else {
      this.parent.destroy();
    }

    this.transform.x = nextX;
    this.transform.y = nextY;

    if (!this.onSurface) {
      this.vy += this.gravity * Time.deltaTime;
    }
  }
}

window.MarioGameObject = MarioGameObject;
