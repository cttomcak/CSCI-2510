class BrickBlockControllerComponent extends Component {
  addBrickBlock(X, Y, item, hitPoints) {
    let brickBlockGameObject = new BrickBlockGameObject();
    GameObject.instantiate(brickBlockGameObject);

    brickBlockGameObject.transform.x = X;
    brickBlockGameObject.transform.y = Y;
    brickBlockGameObject.contains = item;
    brickBlockGameObject.hitsLeft = hitPoints;
  }
}

class BrickBlockGameObject extends GameObject {
  name = "BrickBlockGameObject";
  contains = "coin";
  hitsLeft = 1;
  start() {
    this.addComponent(new BrickBlockComponent());
  }
}

class BrickBlockComponent extends Component {
  start() {
    this.size = 16;
    this.contains = this.parent.contains;
    this.addListener(
      GameObject.getObjectByName("ScoreGameObject").getComponent(
        "ScoreComponent"
      )
    );
  }
  gotGot(height) {
    if (height == 30) {
      if (this.parent.hitsLeft > 1) {
        this.parent.hitsLeft -= 1;
      } else {
        this.parent.destroy();
      }
      this.spawnItem();
    }
  }
  spawnItem() {
    if (this.contains == "coin") {
      let coinGameObject = new CoinGameObject();
      GameObject.instantiate(coinGameObject);

      coinGameObject.transform.x = this.transform.x + 8;
      coinGameObject.transform.y = this.transform.y - 24;
      this.updateListeners("GotCoin");
    } else if (this.contains == "star") {
      let starGameObject = new StarGameObject();
      GameObject.instantiate(starGameObject);

      starGameObject.transform.x = this.transform.x;
      starGameObject.transform.y = this.transform.y - 16;
    }
  }
  draw(ctx) {
    ctx.fillStyle = "#994E00";
    ctx.fillRect(this.transform.x, this.transform.y, this.size, -this.size);
  }
}

window.BrickBlockControllerComponent = BrickBlockControllerComponent;
