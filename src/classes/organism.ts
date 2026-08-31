import { Graphics, Point } from "pixi.js";
import { Resource } from "./resource";
import { getKeyValue, getKeyString, convertToKeyString } from "../utils/key";
import { PointPosition } from "./pointPosition";
import { distanceSquared } from "../utils/math";

export class Organism {
	position: Point;
	angle: number = Math.random() * Math.PI * 2;
	speed: number = 1;
	objetive: PointPosition | Resource;
	graphic: Graphics = new Graphics();
	size: number = 20;
	color: string = "#964B00";

	grid: Map<string, Resource[]>;
	resources: Resource[];

	movement_inner_radius: number = 100;
	movement_outer_radius: number = 200;

	constructor(x: number, y: number, grid: Map<string, Resource[]>, resources: Resource[]) {
		this.position = new Point(x, y);
		this.objetive = new PointPosition(x, y);

		this.graphic.circle(0, 0, 20).fill({ color: "#0000ff" });
		// this.graphic.circle(0, 0, this.movement_inner_radius).stroke({ width: 1, color: "#0000ff" });
		// this.graphic.circle(0, 0, this.movement_outer_radius).stroke({ width: 1, color: "#ff0000" });

		this.grid = grid;
		this.resources = resources;
	}

	randomPositionFrontOfCell(inner_radius: number, outer_radius: number): PointPosition {
		const point_angle = this.angle + Math.random() * (Math.PI / 2) - Math.PI / 4;

		const distance = Math.random() * (outer_radius - inner_radius) + inner_radius;

		const new_x = this.position.x + distance * Math.cos(point_angle);
		const new_y = this.position.y + distance * Math.sin(point_angle);

		return new PointPosition(new_x, new_y);
	}

	getClosestResourceFromList(resources: Resource[]): Resource | undefined {
		if (resources.length === 0) {
			return undefined;
		}

		return resources.reduce((closest, item) => {
			const distToItem = distanceSquared(this.position, item.position);
			const distToClosest = distanceSquared(this.position, closest.position);
			return distToItem < distToClosest ? item : closest;
		});
	}

	getListOfSurroundingResources(): Resource[] {
		const keyValue = getKeyValue(this.position);

		let list_of_resources: Resource[] = [];

		for (let x = keyValue.x - 1; x <= keyValue.x + 1; x++) {
			for (let y = keyValue.y - 1; y <= keyValue.y + 1; y++) {
				const key = convertToKeyString(x, y);

				if (this.grid.has(key)) {
					const resources = this.grid.get(key);

					if (resources) {
						list_of_resources.push(...resources);
					}
				}
			}
		}
		return list_of_resources;
	}

	handleResourceObjective(): void {
		if (this.objetive instanceof PointPosition) {
			return;
		}

		const key = getKeyString(this.objetive.position);

		if (this.grid.get(key)!.length - 1 === 0) {
			// delete cell if empty (0 resources)
			this.grid.delete(key);
		} else {
			// remove resource and create new updated grid cell
			const updated_grid_cell = this.grid.get(key)!.filter((r) => r !== this.objetive);
			// "update count" with new grid cell
			this.grid.set(key, updated_grid_cell);
		}

		// remove resouce from total list of resources
		const index = this.resources.indexOf(this.objetive);
		this.resources.splice(index, 1);

		// remove resource from graphic list and destory it0
		this.objetive.graphic.parent?.removeChild(this.objetive.graphic);
		this.objetive.graphic.destroy();
	}

	updateObjective(): void {
		if (this.objetive instanceof Resource) {
			this.handleResourceObjective();
		}

		const closestResource = this.getClosestResourceFromList(this.getListOfSurroundingResources());

		if (closestResource) {
			this.objetive = closestResource;
		} else {
			this.objetive = this.randomPositionFrontOfCell(this.movement_inner_radius, this.movement_outer_radius);
		}
	}

	updatePosition(): void {
		const dist_to_objetive = Math.hypot(this.objetive.position.x - this.position.x, this.objetive.position.y - this.position.y);

		if (dist_to_objetive < this.size / 2) {
			this.updateObjective();
		}

		const angle = Math.atan2(this.objetive.position.y - this.position.y, this.objetive.position.x - this.position.x);

		const x = Math.cos(angle) * this.speed;
		const y = Math.sin(angle) * this.speed;

		this.position.set(this.position.x + x, this.position.y + y);
		this.angle = angle;
	}

	updateRenderParams() {
		this.graphic.position.copyFrom(this.position);
		this.graphic.rotation = this.angle;
	}
}
