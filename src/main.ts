import { Application } from "pixi.js";
import "./style.css";
import { Cell } from "./classes/cell";
import { Resource } from "./classes/resource";
import { key } from "./utils/key";

const app = new Application();

await app.init({ resizeTo: window });

document.getElementById("simulation")!.appendChild(app.canvas);

const CANVAS_WIDTH = app.canvas.width;
const CANVAS_HEIGHT = app.canvas.height;

const grid = new Map<string, Resource[]>();

const resource_count = 50;
const cell_count = 1;

const resources: Resource[] = Array.from({ length: resource_count }, () => {
	const r = new Resource(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT);
	addToGrid(r.x, r.y, r);
	return r;
});

function addToGrid(x: number, y: number, resource: Resource) {

	const k = key(x, y, 200);

	if (!grid.has(k)) {
		grid.set(k, []);
	}

	grid.get(k)!.push(resource);
}

const cells: Cell[] = Array.from({ length: cell_count }, () => new Cell(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, grid, resources));

app.stage.addChild(...resources.map((b) => b.graphic), ...cells.map((b) => b.graphic));

function update() {
	cells.forEach((b) => b.updatePosition());
}

function loop() {
	update();
}

app.ticker.add(loop);
