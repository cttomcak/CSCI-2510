// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

import "./SceneManager.js";
import "./Component.js";
import "./Scene.js";
import "./GameObject.js";
import "./Transform.js";
import "./Camera.js";
import "./Time.js";

let pause = false;
let canvas = document.querySelector("#canv");
let ctx = canvas.getContext("2d");

// Keeps track of which keys are down
let keysDown = [];
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// ^
function keyUp(e) {
  keysDown[e.key] = false;
  if (e.key == "p") {
    pause = !pause;
  }
}

// ^
function keyDown(e) {
  keysDown[e.key] = true;
  if (e.key == " ") {
    e.preventDefault();
  }
}

// Main game loop. Updates and draws lol
function gameLoop() {
  update();
  draw();
}

let letterboxColor = "black";

// Draws all components with draw functions to the screen, as well as letterboxes
// to make stuff look nice
function draw() {
  // Draws the camera background
  ctx.fillStyle = Camera.main.fillStyle;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let pageAspectRatio = canvas.width / canvas.height;

  let scene = SceneManager.getActiveScene();
  ctx.save();

  let logicalScaling = Camera.getZoomedScale(ctx);

  // Sets up the canvas for the proper scaling for world components
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.scale(logicalScaling, logicalScaling);
  ctx.translate(-Camera.main.transform.x, -Camera.main.transform.y);

  // For all game object with draw() functions, draw them
  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.draw) {
        component.draw(ctx);
      }
    }
  }

  // Restores the canvas
  ctx.restore();
  let zeroX = 0;
  let zeroY = 0;

  // Makes the letterboxes
  if (EngineGlobals.requestedAspectRatio > pageAspectRatio) {
    let endHeight = canvas.width / EngineGlobals.requestedAspectRatio;
    let difference = (canvas.height - endHeight) / 2;
    zeroY = difference;
    ctx.fillStyle = letterboxColor;
    ctx.fillRect(0, 0, canvas.width, difference);
    ctx.fillRect(0, canvas.height - difference, canvas.width, difference);
  } else {
    let desiredWidth = canvas.height * EngineGlobals.requestedAspectRatio;
    let difference = (canvas.width - desiredWidth) / 2;
    zeroX = difference;
    ctx.fillStyle = letterboxColor;
    ctx.fillRect(0, 0, difference, canvas.height);
    ctx.fillRect(canvas.width - difference, 0, difference, canvas.height);
  }

  // Sets up the canvas for the proper scaling for GUI components
  ctx.save();
  ctx.translate(zeroX, zeroY);
  ctx.scale(logicalScaling, logicalScaling);

  // For all game object with drawGUI() functions, draw them
  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.drawGUI) {
        component.drawGUI(ctx);
      }
    }
  }
}

// Lets the update functions of all components that have one run
function update() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (pause) {
    return;
  }

  Time.update();

  let scene = SceneManager.getActiveScene();

  // If we change scenes, this is to preserve objects from the previous scenes that
  // have markedDoNotDestroyOnLoad set to true
  if (SceneManager.changedSceneFlag && scene.start) {
    // We do this with the camera because it's already set upon initialization. We don't want to erase it
    let camera = scene.gameObjects[0];
    scene.gameObjects = [];
    scene.gameObjects.push(camera);
    let previousScene = SceneManager.getPreviousScene();
    if (previousScene) {
      for (let gameObject of previousScene.gameObjects) {
        if (gameObject.markedDoNotDestroyOnLoad) {
          scene.gameObjects.push(gameObject);
        }
      }
    }
    // And start the scene
    scene.start(ctx);
    SceneManager.changedSceneFlag = false;
  }

  // Start all game objects that have start functions and haven't been started already
  for (let gameObject of scene.gameObjects) {
    if (gameObject.start && !gameObject.started) {
      gameObject.start(ctx);
      gameObject.started = true;
    }
  }

  // Start all components that have start functions and haven't been started already
  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.start && !component.started) {
        component.start(ctx);
        component.started = true;
      }
    }
  }

  // Destroy game objects that are marked for destruction
  let keptGameObjects = [];
  for (let gameObject of scene.gameObjects) {
    if (!gameObject.markedForDestroy) {
      keptGameObjects.push(gameObject);
    }
  }

  // Update the remaining components
  scene.gameObjects = keptGameObjects;
  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.update) {
        component.update(ctx);
      }
    }
  }
}

// STAAART Y000UR ENGINNNES!!! :D
function start(title, settings = {}) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.title = title;
  
  if (settings) {
    EngineGlobals.requestedAspectRatio = settings.aspectRatio;
    EngineGlobals.logicalWidth = settings.logicalWidth;
    letterboxColor = settings.letterboxColor;
  }
  setInterval(gameLoop, 1000 * Time.deltaTime);
}

// Easy to access globals that are used in many places (including my Mario game)
class EngineGlobals {
  static requestedAspectRatio = 16 / 9;
  static logicalWidth = 1;
}

window.EngineGlobals = EngineGlobals;

window.start = start;
window.engineUpdate = update;
window.engineDraw = draw;
window.keysDown = keysDown;
