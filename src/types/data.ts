export type BalloonPoint = [number, number];
export type BalloonSeries = Record<number, BalloonPoint[]>;

export type DataResult<T> = { data: T; timestamp: number };

export type CacheEntry<T> = { data: T; timestamp: number };

export function isBalloonPoint(p: unknown): p is BalloonPoint {
  return Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number';
}
