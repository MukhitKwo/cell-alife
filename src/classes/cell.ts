import { Graphics } from "pixi.js";

export class Cell {
	x: number;
	y: number;
	angle: number = 0;
	speed: number = 1;
	size: number = 20;
	graphic: Graphics = new Graphics();
	color: string = "#964B00";
	destiny_x: number = Math.random() * 1700;
	destiny_y: number = Math.random() * 800;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;

		const child = {
			offsetX: -this.size,
			offsetY: 0,
			size: this.size,
		};

		this.graphic.rect(-this.size / 2, -this.size / 2, this.size, this.size).fill(this.color);
		this.graphic.rect(child.offsetX - child.size / 2, child.offsetY - child.size / 2, child.size, child.size).fill("#E75480");
	}

	updatePosition(): void {
		const dist_x = this.destiny_x - this.x;
		const dist_y = this.destiny_y - this.y;

		const dist = Math.hypot(dist_x, dist_y);

		if (dist < 1) {
			this.destiny_x = Math.random() * 1700;
			this.destiny_y = Math.random() * 800;
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
		this.graphic.rotation = this.angle; // PixiJS uses .rotation (radians), same unit as ctx.rotate
	}
}
