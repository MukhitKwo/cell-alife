import type { Point } from "pixi.js";

export function key(position: Point, cellSize: number = 200): string {
	const x = Math.floor(position.x / cellSize);
	const y = Math.floor(position.y / cellSize);

	return `${x},${y}`;
}
