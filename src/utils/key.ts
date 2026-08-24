import type { Point } from "pixi.js";

export function normalizeToKey(position: Point, cellSize: number = 200): { x: number; y: number } {
	const x = Math.floor(position.x / cellSize);
	const y = Math.floor(position.y / cellSize);

	return { x, y };
}

export function toKey(position: Point, cellSize: number = 200): string {
	const key = normalizeToKey(position, cellSize);

	return `${key.x},${key.y}`;
}
