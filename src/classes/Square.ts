import type { Graphics } from "pixi.js";

export class Square {
	x: number;
	y: number;
	vx: number = 0;
	vy: number = 0;
	angle: number = 0;
	size: number = 20;
	color: string = "#964B00";
    destiny_x: number = 100;
    destiny_y: number = 100;
   

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	updateSquare(): void {

        const dist_x = this.destiny_x - this.x + 0.00001
        const dist_y = this.destiny_y - this.y + 0.00001

        const dir_x = dist_x/Math.abs(dist_x)
        const dir_y = dist_y/Math.abs(dist_y)

		this.vx = (0.5 * dir_x)
		this.vy = (0.5 * dir_y)

        console.log(this.vx, this.vy);
        

		this.x += this.vx;
		this.y += this.vy;
        
        console.log(this.x, this.y);
        

	}

	drawSquare(g: Graphics) {
		g.x = this.x;
		g.y = this.y;
		g.rotation = this.angle; // PixiJS uses .rotation (radians), same unit as ctx.rotate
	}
}
