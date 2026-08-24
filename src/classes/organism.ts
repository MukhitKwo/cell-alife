import { Graphics, Point } from "pixi.js";
import { Resource } from "./resource";
import { normalizeToKey, toKey } from "../utils/key";
import { PointPosition } from "./pointPosition";

export class Organism {
	position: Point;
	angle: number = Math.random() * Math.PI * 2;
	speed: number = 1;
	objetive: PointPosition | Resource;
	graphic: Graphics = new Graphics();
	size: number = 20;
	color: string = "#964B00";

	SQRT3_OVER_2 = Math.sqrt(3) / 2;
	movement_inner_radius: number = 100;
	movement_outer_radius: number = 200;

	grid: Map<string, Resource[]>;
	resources: Resource[];

	constructor(x: number, y: number, grid: Map<string, Resource[]>, resources: Resource[]) {
		this.position = new Point(x, y);
		this.objetive = new PointPosition(x, y);

		this.graphic.circle(0, 0, 20).fill({ color: "#0000ff" });
		this.graphic.circle(0, 0, this.movement_inner_radius).stroke({ width: 1, color: "#0000ff" });
		this.graphic.circle(0, 0, this.movement_outer_radius).stroke({ width: 1, color: "#ff0000" });

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

	getClosestResource(current_position: Point): Resource | undefined {
		const normaziledKey = normalizeToKey(current_position);

		let list_of_resources: Resource[] = [];

		for (let x = normaziledKey.x - 1; x <= normaziledKey.x + 1; x++) {
			for (let y = normaziledKey.y - 1; y <= normaziledKey.y + 1; y++) {
				const key = `${x},${y}`;

				if (this.grid.has(key)) {
					const resources = this.grid.get(key);

					if (resources) {
						list_of_resources.push(...resources);
					}
				}
			}
		}

		console.log(list_of_resources);

		const closest = this.getClosest(this.position, list_of_resources);

		return closest;
	}

	getClosest(target: Point, items: Resource[]): Resource | undefined {
		if (items.length === 0) return undefined;

		return items.reduce((closest, item) => {
			const distToItem = this.distanceSquared(target, item.position);
			const distToClosest = this.distanceSquared(target, closest.position);
			return distToItem < distToClosest ? item : closest;
		});
	}

	distanceSquared(a: Point, b: Point): number {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return dx * dx + dy * dy;
	}

	updatePosition(): void {
		const dist_to_objetive = Math.hypot(this.objetive.position.x - this.position.x, this.objetive.position.y - this.position.y);

		if (dist_to_objetive < 1) {
			if (this.objetive instanceof Resource) {
				const k = toKey(this.objetive.position);

				// remove resource and create new updated grid cell
				const updated_grid_cell = this.grid.get(k)!.filter((r) => r !== this.objetive);

				// delete cell if empty
				if (updated_grid_cell.length === 0) {
					this.grid.delete(k);
				} else {
					// else update with new count
					this.grid.set(k, updated_grid_cell);
				}

				// remove resouce from total list of resources
				const index = this.resources.indexOf(this.objetive);
				this.resources.splice(index, 1);

				// remove resource from graphic list and destory it
				this.objetive.graphic.parent?.removeChild(this.objetive.graphic);
				this.objetive.graphic.destroy();
			}

			const closestResource = this.getClosestResource(this.position);

			if (closestResource) {
				this.objetive = closestResource;
			} else {
				this.objetive = this.randomPositionFrontOfCell(this.movement_inner_radius, this.movement_outer_radius);
			}
		}

		const angle = Math.atan2(this.objetive.position.y - this.position.y, this.objetive.position.x - this.position.x);

		const x = Math.cos(angle) * this.speed;
		const y = Math.sin(angle) * this.speed;

		this.position.set(this.position.x + x, this.position.y + y);
		this.angle = angle;

		this.updateRenderParams();
	}

	updateRenderParams() {
		this.graphic.position.copyFrom(this.position);
		this.graphic.rotation = this.angle;
	}
}
