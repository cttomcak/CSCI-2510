// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

// A manager for all of our scenes
class SceneManager {
  static scenes = [];
  static currentScene = 0;
  static changedSceneFlag = true;
  static previousScene = null;

  // Sets the list of scenes with the given list
  static setScenes(scenes) {
    SceneManager.currentScene = 0;
    SceneManager.changedScene = true;
    SceneManager.scenes = [];
    for (let scene of scenes) {
      SceneManager.scenes.push(scene);
    }
  }

  // Returns the current scene
  static getActiveScene() {
    return SceneManager.scenes[SceneManager.currentScene];
  }

  // Gets the previous scene (if there is none, it's null)
  static getPreviousScene() {
    return SceneManager.scenes[SceneManager.previousScene];
  }
  
  // Changes the scene
  static changeScene(index) {
    SceneManager.previousScene = SceneManager.currentScene;
    SceneManager.currentScene = index;
    SceneManager.changedSceneFlag = true;
  }
}

window.SceneManager = SceneManager;
