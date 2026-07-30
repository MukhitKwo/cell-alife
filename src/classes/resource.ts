import { Graphics, Point } from "pixi.js";

export class Resource {
	position: Point;
	size: number = 10;
	graphic: Graphics = new Graphics();
	color: string = "#00ff00";

    constructor(x: number, y: number) {
        this.position = new Point(x, y);
        this.graphic.circle(-this.size / 2, -this.size / 2, this.size).fill(this.color);
        this.graphic.position = this.position;
        // this.graphic.position.set(x, y);
        // this.graphic.position.copyFrom(this.position);
    }
}
