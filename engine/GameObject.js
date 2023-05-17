// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

class GameObject {
  name = "";
  components = [];
  started = false;
  markedForDestroy = false;
  markedDoNotDestroyOnLoad = false;

  // Make a new game object. Transform is always the first component added
  constructor(name) {
    this.name = name;
    this.addComponent(new Transform());
  }

  // Returns transform
  get transform() {
    return this.components[0];
  }

  // Adds a new component
  addComponent(component) {
    this.components.push(component);
    component.parent = this;
    return this;
  }

  // Gets an object by it's name by returning the first object that matches
  static getObjectByName(name) {
    return SceneManager.getActiveScene().gameObjects.find(
      (gameObject) => gameObject.name == name
    );
  }

  // Gets all the objects that go by a name by filtering the list
  static getObjectsByName(name) {
    return SceneManager.getActiveScene().gameObjects.filter(
      (gameObject) => gameObject.name == name
    );
  }

  // Returns a component owned by this game object
  getComponent(name) {
    return this.components.find((c) => c.name == name);
  }

  // Marks it for desruction
  destroy() {
    this.markedForDestroy = true;
  }

  // Carries it over to the next scene if this is true
  doNotDestroyOnLoad() {
    this.markedDoNotDestroyOnLoad = true;
  }

  // Shortcut to add an object to the active scene
  static instantiate(gameObject) {
    SceneManager.getActiveScene().gameObjects.push(gameObject);
    
    if (gameObject.start && !gameObject.started) {
      gameObject.started = true;
      gameObject.start();
    }
  }
}
window.GameObject = GameObject;
