export function truncate(val: number): number {
  return Math.trunc(val * 1000) / 1000;
}

export function getConversions(
  amount: number,
  fromRate: number,
  toRate: number
): number[] {
  return [
    truncate((toRate / fromRate) * amount),
    truncate(toRate / fromRate),
    truncate(fromRate / toRate)
  ];
}
