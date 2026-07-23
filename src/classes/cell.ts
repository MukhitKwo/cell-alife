import { Graphics } from "pixi.js";
import { hexagonPointsTangent } from "../utils/hex";

interface Position {
	x: number;
	y: number;
}

export class Cell {
	x: number;
	y: number;
	angle: number = 0;
	speed: number = 1;
	size: number = 20;
	graphic: Graphics = new Graphics();
	color: string = "#964B00";
	destiny_x: number;
	destiny_y: number;
	SQRT3_OVER_2 = Math.sqrt(3) / 2;
	movement_inner_radius: number = 50;
	movement_outer_radius: number = 100;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;

		const child = {
			offsetX: this.size / 2,
			offsetY: this.size * this.SQRT3_OVER_2,
			size: this.size,
		};

		this.graphic.poly(hexagonPointsTangent(this.size, 0, 0)).fill(this.color);
		this.graphic.poly(hexagonPointsTangent(child.size, -child.offsetX, -child.offsetY)).fill("#E75480");
		this.graphic.poly(hexagonPointsTangent(child.size, -child.offsetX, child.offsetY)).fill("#E74506");
		this.graphic.poly(hexagonPointsTangent(child.size, -child.size, 0)).fill("#E74506");
		this.graphic.poly(hexagonPointsTangent(child.size, -child.size * 2, 0)).fill("#E74506");
		this.graphic.circle(0, 0, 50).stroke({ width: 1, color: "#0000ff" });
		this.graphic.circle(0, 0, 100).stroke({ width: 1, color: "#0000ff" });
		this.graphic.circle(0, 0, 200).stroke({ width: 1, color: "#ff0000" });

		const new_position = this.randomPositionFrontOfCell(this.movement_inner_radius, this.movement_outer_radius);

		this.destiny_x = new_position.x;
		this.destiny_y = new_position.y;
	}

	randomPositionFrontOfCell(inner_radius: number, outer_radius: number): Position {
		const point_angle = this.angle + Math.random() * (Math.PI / 2) - Math.PI / 4;

		const distance = Math.random() * (outer_radius - inner_radius) + inner_radius;

		const new_x = this.x + distance * Math.cos(point_angle);
		const new_y = this.y + distance * Math.sin(point_angle);

		return { x: new_x, y: new_y };
	}

	updatePosition(): void {
		const dist_x = this.destiny_x - this.x;
		const dist_y = this.destiny_y - this.y;

		const dist = Math.hypot(dist_x, dist_y);

		if (dist < 1) {
			const new_position = this.randomPositionFrontOfCell(this.movement_inner_radius, this.movement_outer_radius);

			this.destiny_x = new_position.x;
			this.destiny_y = new_position.y;
		}

		const angle = Math.atan2(dist_y, dist_x);

		const x = Math.cos(angle) * this.speed;
		const y = Math.sin(angle) * this.speed;

		this.x += x;
		this.y += y;
		this.angle = angle;

		this.updateRenderParams();
	}

	updateRenderParams() {
		this.graphic.x = this.x;
		this.graphic.y = this.y;
		this.graphic.rotation = this.angle;
	}
}
