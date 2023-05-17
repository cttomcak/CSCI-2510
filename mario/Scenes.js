import "/engine/engine.js";
import "./BlockItems.js";
import "./QuestionBlock.js";
import "./Camera.js";
import "./Goomba.js";
import "./Mario.js";
import "./BrickBlock.js";
import "./Hole.js";
import "./Koopa.js";
import "./GUIobjects.js";
import "./Pipe.js";

class GroundComponent extends Component {
  start() {
    this.y = 144;
  }
  draw(ctx) {
    ctx.fillStyle = "#994E00";
    let coords = Camera.GUIToWorld(ctx, 0, 0);
    ctx.fillRect(coords.x, this.y, EngineGlobals.logicalWidth, 48);
  }
}

class PoleGameObject extends GameObject {
  name = "PoleGameObject";
  start(ctx) {
    this.addComponent(new PoleComponent());
    this.transform.x = 3176;
    this.transform.y = 144;
  }
}

class PoleComponent extends Component {
  draw(ctx) {
    ctx.fillStyle = "#88D800";
    ctx.fillRect(this.transform.x, this.transform.y, 4, -200);
    ctx.fillStyle = "#0D9300";
    ctx.fillRect(this.transform.x - 2, this.transform.y - 200, 8, 8);
  }
}

class StartGameObject extends GameObject {
  name = "StartGameObject";
  start() {
    this.addComponent(new StartComponent());
    this.addComponent(
      new GUITextCentered("BUDGET SUPER MARIO", "white", "30px Impact")
    );
    this.addComponent(new OffsetGUIText(0, 40, "PRESS 'A' TO START"));
    this.transform.x = 256;
    this.transform.y = 150;
  }
}

class StartComponent extends Component {
  update() {
    if (keysDown["a"]) {
      SceneManager.changeScene(1);
    }
  }
}

class StartScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("GroundGameObject").addComponent(new GroundComponent())
    );
    this.addGameObject(new StartGameObject());
    this.addGameObject(
      new GameObject("CameraControllerGameobject").addComponent(
        new CameraControllerComponent()
      )
    );
  }
}

class MainScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("CameraControllerGameobject").addComponent(
        new CameraControllerComponent()
      )
    );

    this.addGameObject(
      new GameObject("GroundGameObject").addComponent(new GroundComponent())
    );

    let GOGO = new GUIobjectsControllerComponent();
    this.addGameObject(
      new GameObject("GUIobjectsGameObject").addComponent(GOGO)
    );

    let HCC = new HoleControllerComponent();
    this.addGameObject(
      new GameObject("HoleControllerGameObject").addComponent(HCC)
    );

    let QBCC = new QuestionBlockControllerComponent();
    this.addGameObject(
      new GameObject("QuestionBlockControllerGameObject").addComponent(QBCC)
    );

    let BBCC = new BrickBlockControllerComponent();
    this.addGameObject(
      new GameObject("BrickBlockControllerGameObject").addComponent(BBCC)
    );

    let GCC = new GoombaControllerComponent();
    this.addGameObject(
      new GameObject("GoombaControllerGameObject").addComponent(GCC)
    );

    let KCC = new KoopaControllerComponent();
    this.addGameObject(
      new GameObject("KoopaControllerGameObject").addComponent(KCC)
    );

    let PCC = new PipeControllerComponent();
    this.addGameObject(
      new GameObject("PipeControllerGameObject").addComponent(PCC)
    );

    QBCC.addQuestionBlock(256, 80, "coin", false);
    BBCC.addBrickBlock(320, 80, "coin", 1);
    QBCC.addQuestionBlock(336, 80, "mushroom", false);
    BBCC.addBrickBlock(352, 80, "coin", 1);
    QBCC.addQuestionBlock(368, 80, "coin", false);
    BBCC.addBrickBlock(384, 80, "coin", 1);
    QBCC.addQuestionBlock(352, 0, "coin", false);
    QBCC.addQuestionBlock(1024, 64, "star", true);
    HCC.addHole(1104, 32);
    BBCC.addBrickBlock(1232, 80, "coin", 1);
    QBCC.addQuestionBlock(1248, 80, "mushroom", false);
    BBCC.addBrickBlock(1264, 80, "coin", 1);
    BBCC.addBrickBlock(1280, 0, "coin", 1);
    BBCC.addBrickBlock(1296, 0, "coin", 1);
    BBCC.addBrickBlock(1312, 0, "coin", 1);
    BBCC.addBrickBlock(1328, 0, "coin", 1);
    BBCC.addBrickBlock(1344, 0, "coin", 1);
    BBCC.addBrickBlock(1360, 0, "coin", 1);
    BBCC.addBrickBlock(1376, 0, "coin", 1);
    BBCC.addBrickBlock(1392, 0, "coin", 1);
    HCC.addHole(1376, 48);
    BBCC.addBrickBlock(1456, 0, "coin", 1);
    BBCC.addBrickBlock(1472, 0, "coin", 1);
    BBCC.addBrickBlock(1488, 0, "coin", 1);
    QBCC.addQuestionBlock(1504, 0, "mushroom", false);
    BBCC.addBrickBlock(1504, 80, "coin", 10);
    BBCC.addBrickBlock(1600, 80, "coin", 1);
    BBCC.addBrickBlock(1616, 80, "star", 1);
    QBCC.addQuestionBlock(1696, 80, "coin", false);
    QBCC.addQuestionBlock(1744, 80, "coin", false);
    QBCC.addQuestionBlock(1792, 80, "coin", false);
    QBCC.addQuestionBlock(1744, 0, "mushroom", false);
    BBCC.addBrickBlock(1888, 80, "coin", 1);
    BBCC.addBrickBlock(1936, 0, "coin", 1);
    BBCC.addBrickBlock(1952, 0, "coin", 1);
    BBCC.addBrickBlock(1968, 0, "coin", 1);
    BBCC.addBrickBlock(2048, 80, "coin", 1);
    QBCC.addQuestionBlock(2064, 0, "coin", false);
    QBCC.addQuestionBlock(2080, 0, "coin", false);
    BBCC.addBrickBlock(2096, 80, "coin", 1);
    BBCC.addBrickBlock(2064, 80, "coin", 1);
    BBCC.addBrickBlock(2080, 80, "coin", 1);
    HCC.addHole(2448, 32);
    BBCC.addBrickBlock(2688, 80, "coin", 1);
    BBCC.addBrickBlock(2704, 80, "coin", 1);
    QBCC.addQuestionBlock(2720, 80, "coin", false);
    BBCC.addBrickBlock(2736, 80, "coin", 1);
    PCC.addPipe(450, 144, 32);
    PCC.addPipe(610, 144, 48);
    PCC.addPipe(738, 144, 64);
    PCC.addPipe(914, 144, 64);
    PCC.addPipe(2610, 144, 32);
    PCC.addPipe(2866, 144, 32);
    GCC.addGoomba(352, 144);
    GCC.addGoomba(640, 144);
    GCC.addGoomba(816, 144);
    GCC.addGoomba(838, 144);
    GCC.addGoomba(1280, 144);
    GCC.addGoomba(1312, 144);
    GCC.addGoomba(1552, 144);
    GCC.addGoomba(1576, 144);
    KCC.addKoopa(1716, 144);
    GCC.addGoomba(1824, 144);
    GCC.addGoomba(1848, 144);
    GCC.addGoomba(1984, 144);
    GCC.addGoomba(2008, 144);
    GCC.addGoomba(2048, 144);
    GCC.addGoomba(2072, 144);
    GCC.addGoomba(2784, 144);
    GCC.addGoomba(2806, 144);

    this.addGameObject(new PoleGameObject());

    this.addGameObject(new MarioGameObject());
  }
}

class EndGameObject extends GameObject {
  name = "EndGameObject";
  start() {
    this.addComponent(new EndComponent());
    this.addComponent(
      new GUITextCentered("YOU FINISHED", "white", "30px Impact")
    );
    let scoreGameObject = GameObject.getObjectByName("ScoreGameObject");
    let score = scoreGameObject.score;
    scoreGameObject.destroy();
    let timeGameObject = GameObject.getObjectByName("TimeGameObject");
    let time = timeGameObject.time;
    timeGameObject.destroy();
    this.addComponent(new OffsetGUIText(0, 40, "SCORE: " + score));
    this.addComponent(new OffsetGUIText(0, 80, "TIME: " + Math.round(time)));
    this.addComponent(new OffsetGUIText(0, 120, "PRESS 'A' TO RESTART"));
    this.transform.x = 256;
    this.transform.y = 110;
  }
}

class EndComponent extends Component {
  update() {
    if (keysDown["a"]) {
      SceneManager.changeScene(1);
    }
  }
}

class EndScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("GroundGameObject").addComponent(new GroundComponent())
    );
    this.addGameObject(new EndGameObject());
    this.addGameObject(
      new GameObject("CameraControllerGameobject").addComponent(
        new CameraControllerComponent()
      )
    );
  }
}

let startScene = new StartScene();
let mainScene = new MainScene();
let endScene = new EndScene();

window.allScenes = [startScene, mainScene, endScene];
