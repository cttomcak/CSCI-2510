class QuestionBlockControllerComponent extends Component {
  addQuestionBlock(X, Y, item, invisible) {
    let questionBlockGameObject = new QuestionBlockGameObject();
    GameObject.instantiate(questionBlockGameObject);

    questionBlockGameObject.transform.x = X;
    questionBlockGameObject.transform.y = Y;
    questionBlockGameObject.contains = item;
    questionBlockGameObject.invisible = invisible;
  }
}

class QuestionBlockGameObject extends GameObject {
  name = "QuestionBlockGameObject";
  contains = "coin";
  invisible = false;
  start() {
    this.addComponent(new QuestionBlockComponent());
  }
}

class QuestionBlockComponent extends Component {
  start() {
    this.size = 16;
    this.beenHit = false;
    this.addListener(
      GameObject.getObjectByName("ScoreGameObject").getComponent(
        "ScoreComponent"
      )
    );
  }
  spawnItem(height) {
    if (!this.beenHit) {
      if (this.parent.contains == "mushroom") {
        if (height < 30) {
          let mushroomGameObject = new MushroomGameObject();
          GameObject.instantiate(mushroomGameObject);

          mushroomGameObject.transform.x = this.transform.x;
          mushroomGameObject.transform.y = this.transform.y - 16;
        } else {
          let fireFlowerGameObject = new FireFlowerGameObject();
          GameObject.instantiate(fireFlowerGameObject);

          fireFlowerGameObject.transform.x = this.transform.x;
          fireFlowerGameObject.transform.y = this.transform.y - 16;
        }
      } else if (this.parent.contains == "coin") {
        let coinGameObject = new CoinGameObject();
        GameObject.instantiate(coinGameObject);

        coinGameObject.transform.x = this.transform.x + 8;
        coinGameObject.transform.y = this.transform.y - 24;
        this.updateListeners("GotCoin");
      } else if (this.parent.contains == "star") {
        let starGameObject = new StarGameObject();
        GameObject.instantiate(starGameObject);

        starGameObject.transform.x = this.transform.x;
        starGameObject.transform.y = this.transform.y - 16;
      }
      this.beenHit = true;
    }
  }
  draw(ctx) {
    if (!this.beenHit) {
      if (!this.parent.invisible) {
        ctx.fillStyle = "#EA9E22";
        ctx.fillRect(this.transform.x, this.transform.y, this.size, -this.size);
        ctx.fillStyle = "#994E00";
        ctx.font = "16px Garamond";
        ctx.fillText("?", this.transform.x + 4, this.transform.y - 2);
      }
    } else {
      ctx.fillStyle = "#b25303";
      ctx.fillRect(this.transform.x, this.transform.y, this.size, -this.size);
    }
  }
}

window.QuestionBlockControllerComponent = QuestionBlockControllerComponent;
