export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function weightedRandom(items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  const r = Math.random() * total;

  let acc = 0;
  for (let i = 0; i < items.length; i += 1) {
    acc += weights[i];
    if (r <= acc) {
      return items[i];
    }
  }
  return items[items.length - 1];
}
