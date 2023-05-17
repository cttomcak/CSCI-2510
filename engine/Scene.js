// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

class Scene {
  gameObjects = [];

  // Builds a new scene. The first object is always a new camera
  constructor() {
    this.addGameObject(
      new GameObject("CameraGameObject").addComponent(new Camera())
    );
  }

  // Add a new game object to the scene
  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
    if (gameObject.start && !gameObject.started) {
      gameObject.started = true;
      gameObject.start();
    }
  }
}

window.Scene = Scene;
