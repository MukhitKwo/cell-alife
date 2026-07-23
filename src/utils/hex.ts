export function hexagonPointsTangent(circleDiameter: number, offsetX = 0, offsetY = 0): number[] {
	const circumradius = circleDiameter / 2 / Math.cos(Math.PI / 6);
	return hexagonPoints(circumradius, offsetX, offsetY);
}

function hexagonPoints(radius: number, offsetX = 0, offsetY = 0): number[] {
	const points: number[] = [];
	for (let i = 0; i < 6; i++) {
		const angle = Math.PI / 6 + (Math.PI / 3) * i;
		points.push(radius * Math.cos(angle) + offsetX, radius * Math.sin(angle) + offsetY);
	}
	return points;
}
