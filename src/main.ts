import { Application, Graphics } from 'pixi.js';
import { Square } from './classes/Square';
import './style.css';

// PixiJS uses an Application instead of a raw <canvas> + context.
// It manages the WebGL renderer, ticker (render loop), and stage (scene graph) for you.
const app = new Application();

// init() is async since it sets up the renderer/canvas.
// resizeTo: window makes the canvas automatically match the window size.
await app.init({ resizeTo: window });

// app.canvas is the actual <canvas> element PixiJS created, append it to the page.
document.getElementById('simulation')!.appendChild(app.canvas);

const size = 20;

// Logical/simulation state lives entirely in the Square class, same as before.
const square = new Square(app.canvas.width / 2, app.canvas.height / 2);

const child = {
  offsetX: 0,
  offsetY: size,
  size: size,
};

// Graphics is PixiJS's shape-drawing object, roughly the visual counterpart
// to what fillRect did in Canvas 2D, but it's a persistent object added to the
// scene graph, not a one-off draw call.
const g = new Graphics();

// Shapes are drawn ONCE here, relative to (0,0), the object's own local origin.
// We don't redraw the fill every frame; instead we move/rotate the whole
// Graphics object each frame (see drawSquare below), which is much cheaper.
g.rect(-square.size / 2, -square.size / 2, square.size, square.size).fill(square.color);
g.rect(child.offsetX - child.size / 2, child.offsetY - child.size / 2, child.size, child.size).fill('#E75480');

const a = new Graphics();
a.rect(100 , 100, 10, 10).fill('#00FF00');


// The stage is PixiJS's root container (like the document body of the scene graph).
// Anything added here gets rendered automatically every tick.
app.stage.addChild(g, a);

// Instead of ctx.translate/rotate/fillRect each frame, we just set the
// Graphics object's transform properties. PixiJS handles the actual
// GPU-side transform and redraw internally.

function update() {
  square.updateSquare();
}

function draw() {
  square.drawSquare(g);
}

function loop() {
  update();
  draw();
}

// app.ticker replaces the manual requestAnimationFrame(loop) call.
// It runs `loop` on every frame, synced to the display refresh rate,
// and PixiJS automatically re-renders the stage after each tick.
app.ticker.add(loop);