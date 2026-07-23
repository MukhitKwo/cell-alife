interface Point {
  x: number;
  y: number;
}

export function getClosest<T extends Point>(target: Point, items: T[]): T | undefined {
  if (items.length === 0) return undefined;

  return items.reduce((closest, item) => {
    const distToItem = distanceSquared(target, item);
    const distToClosest = distanceSquared(target, closest);
    return distToItem < distToClosest ? item : closest;
  });
}

function distanceSquared(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}