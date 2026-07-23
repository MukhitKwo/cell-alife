import { Application } from 'pixi.js';
import './style.css';
import { Cell } from './classes/cell';
import { Resource } from './classes/resource';

const app = new Application();

await app.init({ resizeTo: window });

document.getElementById('simulation')!.appendChild(app.canvas);

const cell_count = 5;
const resource_count = 5;

const cells: Cell[] = Array.from(
  { length: cell_count },
  () => new Cell(Math.random() * 1700, Math.random() * 800)
);

const resources: Resource[] = Array.from(
  { length: resource_count },
  () => new Resource(Math.random() * 1700, Math.random() * 800)
);

app.stage.addChild(...cells.map(b => b.graphic), ...resources.map(b => b.graphic));

function update() {
  cells.forEach(b => b.updatePosition());
}

function loop() {
  update();
}

app.ticker.add(loop);