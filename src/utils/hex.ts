export function hexagonPoints(circleDiameter: number, offsetX = 0, offsetY = 0): number[] {
	const circumradius = circleDiameter / 2 / Math.cos(Math.PI / 6);

	const points: number[] = [];
	for (let i = 0; i < 6; i++) {
		const angle = Math.PI / 6 + (Math.PI / 3) * i;
		points.push(circumradius * Math.cos(angle) + offsetX, circumradius * Math.sin(angle) + offsetY);
	}
	return points;
}
