// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

// Simple class that keeps track of where a GameObject is, and it's scale
class Transform extends Component {
  name = "Transform";
  x = 0;
  y = 0;
  sx = 1;
  sy = 1;
}

window.Transform = Transform;
