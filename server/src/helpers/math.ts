/**
 * This function does a linear interpolation between two provided values.
 * @param start The start value of the interval in which the interpolation should be done.
 * @param end The end value of the interval in which the interpolation should be done.
 * @param alpha The alpha to determine the position of the linear interpolation between the start and end values (between 0 and 1)
 */
export function linearInterpolation(start: number, end: number, alpha: number): number {
    return start + (end - start) * alpha;
}