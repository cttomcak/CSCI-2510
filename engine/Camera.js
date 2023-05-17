// The game engine is obviously heavily inspired by (and transcribed from)
// Dr. Brian Ricks' game engine, which we worked on all semester.

class Camera extends Component {
  name = "Camera";
  fillStyle = "black";

  // Accounts for logical space and camera zoom
  static getZoomedScale(ctx) {
    let pageAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let pageWidth = ctx.canvas.width;

    if (EngineGlobals.requestedAspectRatio <= pageAspectRatio)
      pageWidth -=
        ctx.canvas.width -
        ctx.canvas.height * EngineGlobals.requestedAspectRatio;

    return (pageWidth / EngineGlobals.logicalWidth) * Camera.main.transform.sx;
  }

  // Gives the ratio between the width and the logical width
  static getLogicalScale(ctx) {
    let pageAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let pageWidth = ctx.canvas.width;

    if (EngineGlobals.requestedAspectRatio <= pageAspectRatio)
      pageWidth -=
        ctx.canvas.width -
        ctx.canvas.height * EngineGlobals.requestedAspectRatio;

    return pageWidth / EngineGlobals.logicalWidth;
  }

  // Get the beginnings of the actual logical space (after the letterboxes)
  static getZeros(ctx) {
    let pageAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let zeroX = 0;
    let zeroY = 0;

    if (EngineGlobals.requestedAspectRatio > pageAspectRatio)
      zeroY =
        (ctx.canvas.height -
          ctx.canvas.width / EngineGlobals.requestedAspectRatio) /
        2;
    else
      zeroX =
        (ctx.canvas.width -
          ctx.canvas.height * EngineGlobals.requestedAspectRatio) /
        2;

    return { zeroX, zeroY };
  }

  // Convert coordinate in GUI space to coordinates in World Space
  static GUIToWorld(ctx, x, y) {
    let logicalScale = Camera.getLogicalScale(ctx);

    let zoomableScale = Camera.getZoomedScale(ctx);

    let zeroes = Camera.getZeros(ctx, x, y);

    x =
      (x * logicalScale + zeroes.zeroX - ctx.canvas.width / 2) / zoomableScale +
      Camera.main.transform.x;
    y =
      (y * logicalScale + zeroes.zeroY - ctx.canvas.height / 2) /
        zoomableScale +
      Camera.main.transform.y;

    return { x, y };
  }

  // Convert coordinate in World space to coordinates in GUI Space
  static worldToGUI(ctx, x, y) {
    let zoomableScale = Camera.getZoomedScale(ctx);

    let logicalScale = Camera.getLogicalScale(ctx);

    let zeroes = Camera.getZeros(ctx);

    x =
      ((x - Camera.main.transform.x) * zoomableScale +
        ctx.canvas.width / 2 -
        zeroes.zeroX) /
      logicalScale;
    y =
      ((y - Camera.main.transform.y) * zoomableScale +
        ctx.canvas.width / 2 -
        zeroes.zeroY) /
      logicalScale;

    return { x, y };
  }

  // Simply returns the camera in the current scene
  static get main() {
    let scene = SceneManager.getActiveScene();
    return scene.gameObjects[0].components[1];
  }
}

window.Camera = Camera;
