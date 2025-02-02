export function zip<X, Y>(xs: readonly X[], ys: readonly Y[]): [X, Y][] {
  return xs.slice(0, Math.min(xs.length, ys.length)).map((x, i) => [x, ys[i]!]);
}
