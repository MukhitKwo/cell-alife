import type { Point } from "pixi.js";

export function getKeyValue(position: Point, cellSize: number = 200): { x: number; y: number } {
	const x = Math.floor(position.x / cellSize);
	const y = Math.floor(position.y / cellSize);

	return { x, y };
}

export function getKeyString(position: Point, cellSize: number = 200): string {
	const key = getKeyValue(position, cellSize);

	return `${key.x},${key.y}`;
}

export function convertToKeyString(x: number, y: number): string {
	return `${x},${y}`;
}
