/**
 * Simple helper function to check if a value is between two other values.
 * The comparison is inclusive (returns true if value == min or if value == max).
 * @param value The value that should be checked against the min and max values.
 * @param min The minimum value.
 * @param max The maximum value.
 */
export function isBetween(value: number, min: number, max: number): boolean {
    if (min > max) {
      let tmp = max;
      max = min;
      min = tmp;
    }
    return value >= min && value <= max;
}
