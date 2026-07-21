import './style.css';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const square = {
  x: canvas.width / 2,      // horizontal center, fixed
  y: canvas.height / 2,     // current vertical position, updates each frame
  size: 50,                 // width/height of the square
  angle: 0,                 // current rotation, in radians
  baseY: canvas.height / 2, // resting center, oscillation midpoint
  time: 0,                  // drives the sine wave motion
};

function update() {
  square.angle += 0.03;                          // spin a bit more each frame
  square.time += 0.02;                           // advance the oscillation clock
  square.y = square.baseY + Math.sin(square.time) * 100; // bob up and down
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // wipe last frame

  ctx.save();                     // isolate the transform below
  ctx.translate(square.x, square.y); // move origin to square's center
  ctx.rotate(square.angle);          // rotate around that new origin
  ctx.fillStyle = '#4dabf7';         // square color
  ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size); // draw centered
  ctx.restore();                  // undo translate/rotate for next draw
}

function loop() {
  update();                        // move things
  draw();                          // render things
  requestAnimationFrame(loop);     // schedule next frame
}

loop();