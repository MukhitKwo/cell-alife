import { Application } from "pixi.js";
import "./style.css";
import { Organism } from "./classes/organism";
import { Resource } from "./classes/resource";
import { getKeyString } from "./utils/key";

const app = new Application();

await app.init({ resizeTo: window });

document.getElementById("simulation")!.appendChild(app.canvas);

const CANVAS_WIDTH = app.canvas.width;
const CANVAS_HEIGHT = app.canvas.height;

const grid = new Map<string, Resource[]>();

const resource_count = 25;
const cell_count = 1;

const resources: Resource[] = Array.from({ length: resource_count }, () => {
	const resource = new Resource(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT);
	addToGrid(resource);
	return resource;
});

function addToGrid(resource: Resource) {
	const k = getKeyString(resource.position);

	if (!grid.has(k)) {
		grid.set(k, []);
	}

	grid.get(k)!.push(resource);
}

const cells: Organism[] = Array.from({ length: cell_count }, () => new Organism(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, grid, resources));

app.stage.addChild(...resources.map((b) => b.graphic), ...cells.map((b) => b.graphic));

function update() {
	cells.forEach((b) => {
		b.updatePosition();
		b.updateRenderParams();
	});
}

function loop() {
	update();
}

app.ticker.add(loop);
