import { Graphics } from "pixi.js";

export class Resource {
	x: number;
	y: number;
	size: number = 10;
	graphic: Graphics = new Graphics();
	color: string = "#00ff00";

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.graphic.circle(-this.size / 2, -this.size / 2, this.size).fill(this.color);
        this.graphic.x = this.x;
		this.graphic.y = this.y;
    }
}
