import { Point } from "pixi.js"

export class PointPosition {
    position: Point;

    constructor(x: number, y: number){
        this.position = new Point(x, y);
    }
}