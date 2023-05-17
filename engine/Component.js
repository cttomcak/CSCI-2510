// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

class Component {
  name = this.constructor.name;
  parent;
  started = false;
  listeners = [];

  // Adds a component that can "listen" to this component
  addListener(listener) {
    this.listeners.push(listener);
  }

  // Listening system. Effectively sends a message to another component by calling it's update handler
  updateListeners(eventName) {
    for (let listener of this.listeners) {
      if (listener.handleUpdate) {
        listener.handleUpdate(this, eventName);
      }
    }
  }

  // Returns it's parent's transform object
  get transform() {
    return this.parent.transform;
  }
}
window.Component = Component;
