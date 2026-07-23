export function key(x: number, y: number, cellSize: number = 100): string {
	x = Math.floor(x / cellSize);
	y = Math.floor(y / cellSize);

	return `${x},${y}`;
}
