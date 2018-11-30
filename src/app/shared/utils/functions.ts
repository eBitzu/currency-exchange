export function truncate(val: number): number {
  return Math.trunc(val * 1000) / 1000;
}

export function getConversions(
  amount: number,
  fromRate: number,
  toRate: number
): number[] {
  const inversedToRate = 1 / toRate;
  const dolarAmount = amount * fromRate;
  return [
    truncate(dolarAmount * inversedToRate),
    truncate(fromRate * inversedToRate),
    truncate(toRate / fromRate)
  ];
}
