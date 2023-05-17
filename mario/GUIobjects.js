class GUIobjectsControllerComponent extends Component {
  start() {
    GameObject.instantiate(new ScoreGameObject());
    GameObject.instantiate(new TimeGameObject());
    GameObject.instantiate(new LevelTextGameObject());
    GameObject.instantiate(new CoinTextGameObject());
  }
}

class ScoreGameObject extends GameObject {
  name = "ScoreGameObject";
  score = 0;
  start(ctx) {
    this.addComponent(new GUITextCentered("SCORE", "white", "20px Impact"));
    this.addComponent(new ScoreComponent());
    this.addComponent(new OffsetGUIText(0, 20, this.score));
    this.transform.x = 70;
    this.transform.y = 20;
    this.doNotDestroyOnLoad();
  }
  updateText() {
    this.getComponent("OffsetGUIText").text = this.score;
  }
}

class ScoreComponent extends Component {
  handleUpdate(component, eventName) {
    if (eventName == "GotCoin") {
      this.parent.score += 200;
    } else if (eventName == "KillGoomba") {
      this.parent.score += 100;
    } else if (eventName == "HitKoopa") {
      this.parent.score += 100;
    }
    this.parent.updateText();
  }
}

class TimeGameObject extends GameObject {
  name = "TimeGameObject";
  time = 300;
  start(ctx) {
    this.addComponent(new GUITextCentered("TIME", "white", "20px Impact"));
    this.addComponent(new TimeComponent());
    this.addComponent(new OffsetGUIText(0, 20, Math.round(this.time)));
    this.transform.x = 450;
    this.transform.y = 20;
    this.doNotDestroyOnLoad();
  }
  updateText() {
    this.getComponent("OffsetGUIText").text = Math.round(this.time);
  }
}

class TimeComponent extends Component {
  update() {
    this.parent.time -= Time.deltaTime;
    this.parent.updateText();
    if (this.parent.score < 0) {
      SceneManager.changeScene(0);
    }
  }
}

class LevelTextGameObject extends GameObject {
  name = "LevelTextGameObject";
  text = "1-1";
  start(ctx) {
    this.addComponent(new GUITextCentered("WORLD", "white", "20px Impact"));
    this.addComponent(new OffsetGUIText(0, 20, this.text));
    this.transform.x = 200;
    this.transform.y = 20;
  }
}

class CoinTextGameObject extends GameObject {
  name = "CoinTextGameObject";
  coins = 0;
  start(ctx) {
    this.addComponent(new GUITextCentered("COINS", "white", "20px Impact"));
    this.addComponent(new CoinTextComponent());
    this.addComponent(new OffsetGUIText(0, 20, this.coins));
    this.transform.x = 330;
    this.transform.y = 20;
  }
  updateText() {
    this.getComponent("OffsetGUIText").text = this.coins;
  }
}

class CoinTextComponent extends Component {
  addCoin() {
    this.parent.coins += 1;
    this.parent.updateText();
  }
}

class GUITextCentered extends Component {
  constructor(string, fillStyle = "white", font = "20px Impact") {
    super();
    this.fillStyle = fillStyle;
    this.string = string;
    this.font = font;
  }
  drawGUI(ctx) {
    ctx.fillStyle = this.fillStyle;
    ctx.font = this.font;
    let measurements = ctx.measureText(this.string);
    ctx.fillText(
      this.string,
      this.transform.x - measurements.width / 2,
      this.transform.y + measurements.actualBoundingBoxAscent / 2
    );
  }
}

class OffsetGUIText extends Component {
  constructor(offX, offY, text) {
    super();
    this.offsetX = offX;
    this.offsetY = offY;
    this.text = text;
  }
  drawGUI(ctx) {
    ctx.fillStyle = "white";
    let measurements = ctx.measureText(this.text);
    ctx.fillText(
      this.text,
      this.transform.x - measurements.width / 2 + this.offsetX,
      this.transform.y + measurements.actualBoundingBoxAscent / 2 + this.offsetY
    );
  }
}

window.GUIobjectsControllerComponent = GUIobjectsControllerComponent;
window.GUITextCentered = GUITextCentered;
window.OffsetGUIText = OffsetGUIText;
