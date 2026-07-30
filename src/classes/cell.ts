import { Graphics, Point } from "pixi.js";
import { hexagonPoints } from "../utils/hex";
import { Resource } from "./resource";
import { key } from "../utils/key";
import { PointPosition } from "./pointPosition";

export class Cell {
	position: Point;
	angle: number = Math.random() * Math.PI * 2;
	speed: number = 1;
	objetive: PointPosition | Resource;
	graphic: Graphics = new Graphics();
	size: number = 20;
	color: string = "#964B00";

	SQRT3_OVER_2 = Math.sqrt(3) / 2;
	movement_inner_radius: number = 50;
	movement_outer_radius: number = 100;

	grid: Map<string, Resource[]>;
	resources: Resource[];

	constructor(x: number, y: number, grid: Map<string, Resource[]>, resources: Resource[]) {
		this.position = new Point(x, y);
		this.grid = grid;
		this.resources = resources;

		const child = {
			offsetX: this.size / 2,
			offsetY: this.size * this.SQRT3_OVER_2,
			size: this.size,
		};

		//todo refactor and make 1-6 position based
		this.graphic.poly(hexagonPoints(this.size, 0, 0)).fill(this.color);
		this.graphic.poly(hexagonPoints(child.size, -child.offsetX, -child.offsetY)).fill("#E75480");
		this.graphic.poly(hexagonPoints(child.size, -child.offsetX, child.offsetY)).fill("#E74506");
		this.graphic.poly(hexagonPoints(child.size, -child.size, 0)).fill("#E74506");
		this.graphic.poly(hexagonPoints(child.size, -child.size * 2, 0)).fill("#E74506");
		this.graphic.circle(0, 0, 50).stroke({ width: 1, color: "#0000ff" });
		this.graphic.circle(0, 0, 100).stroke({ width: 1, color: "#0000ff" });
		this.graphic.circle(0, 0, 200).stroke({ width: 1, color: "#ff0000" });

		this.objetive = this.randomPositionFrontOfCell(this.movement_inner_radius, this.movement_outer_radius);
	}

	randomPositionFrontOfCell(inner_radius: number, outer_radius: number): PointPosition {
		const point_angle = this.angle + Math.random() * (Math.PI / 2) - Math.PI / 4;

		const distance = Math.random() * (outer_radius - inner_radius) + inner_radius;

		const new_x = this.position.x + distance * Math.cos(point_angle);
		const new_y = this.position.y + distance * Math.sin(point_angle);

		return new PointPosition(new_x, new_y);
	}

	//! fix and move ================================
	getClosestResource(key: string): Resource | undefined {
		if (this.grid.has(key)) {
			const resources = this.grid.get(key);

			if (resources) {
				const closest = this.getClosest(this.position, resources);

				return closest;
			}
		}

		return undefined;
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
	//!===============================

	updatePosition(): void {
		const dist_to_objetive = Math.hypot(this.objetive.position.x - this.position.x, this.objetive.position.y - this.position.y);

		if (dist_to_objetive < 1) {
			if (this.objetive instanceof Resource) {
				const k = key(this.objetive.position);

				const updated_gird_cell = this.grid.get(k)!.filter((r) => r !== this.objetive);

				if (updated_gird_cell.length === 0) {
					this.grid.delete(k);
				} else {
					this.grid.set(k, updated_gird_cell);
				}

				const index = this.resources.indexOf(this.objetive);
				this.resources.splice(index, 1);

				this.objetive.graphic.parent?.removeChild(this.objetive.graphic);
				this.objetive.graphic.destroy();
			}

			const k = key(this.position);

			const closestResource = this.getClosestResource(k);
			console.log(closestResource);

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
		this.graphic.position = this.position;
		this.graphic.rotation = this.angle;
	}
}
