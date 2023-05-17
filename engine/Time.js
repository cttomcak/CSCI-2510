// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

class Time {
  // Our framerate (60)
  static deltaTime = 1 / 60;
  static frameCount = 0;

  // Adds to the framecount
  static update() {
    Time.frameCount++;
  }
}

window.Time = Time;
