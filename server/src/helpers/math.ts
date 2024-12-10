export function linearInterpolation(start: number, end: number, alpha: number): number {
    return start + (end - start) * alpha;
}