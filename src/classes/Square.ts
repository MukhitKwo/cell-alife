export class Square {
	x: number;
	y: number;
	size: number = 20;
	angle: number = 0;
	color: string = "#4dabf7";
    ctx: CanvasRenderingContext2D;

	constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
		this.x = x;
		this.y = y;
        this.ctx = ctx;
	}

	updateSquare(): void {
		this.angle += Math.random() * 0.4 - 0.2;

		this.x = this.x + 1 * Math.sin(this.angle);
		this.y = this.y - 1 * Math.cos(this.angle);
	}
}
