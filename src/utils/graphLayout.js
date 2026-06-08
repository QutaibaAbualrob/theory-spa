/** Circular layout for state nodes. Modifies states in-place with x,y. */
export function layoutCircular(states, cx = 200, cy = 180, radius = 140) {
  const n = states.length;
  states.forEach((s, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    s.x = cx + radius * Math.cos(angle);
    s.y = cy + radius * Math.sin(angle);
  });
  return states;
}

/** Linear layout (left to right). */
export function layoutLinear(states, startX = 80, y = 180, gap = 150) {
  states.forEach((s, i) => {
    s.x = startX + i * gap;
    s.y = y;
  });
  return states;
}

/** Calculate an offset perpendicular to a line segment (for curved edges). */
export function perpOffset(from, to, distance = 40) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    cx: (from.x + to.x) / 2 - (dy / len) * distance,
    cy: (from.y + to.y) / 2 + (dx / len) * distance,
  };
}
