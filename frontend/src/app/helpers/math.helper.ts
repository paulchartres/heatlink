export function isBetween(value: number, min: number, max: number): boolean {
    if (min > max) {
      let tmp = max;
      max = min;
      min = tmp;
    }
    return value >= min && value <= max;
}
