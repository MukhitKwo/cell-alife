import { Square } from './classes/Square';
import './style.css';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const size = 20

const square1 = new Square(canvas.width / 2, canvas.height / 2, ctx);

const child = {
  offsetX: 0, // distance from parent's center, to the right
  offsetY: size,
  size: size,
};

function drawSquare(square: Square) {
  ctx.save();

  ctx.translate(square.x, square.y);
  ctx.rotate(square.angle);

  ctx.fillStyle = square.color;
  ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size);
  
  ctx.fillStyle = 'orange';
  ctx.fillRect(child.offsetX - child.size / 2, child.offsetY - child.size / 2, child.size, child.size);

  ctx.restore();
}

function update() {
  square1.updateSquare();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSquare(square1);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();