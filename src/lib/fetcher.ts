import { DataResult, CacheEntry } from '@/types/data';

export class Fetcher {
  private static cache: Record<string, CacheEntry<unknown>> = {};
  private static TTL = 60 * 1000;

  static async fetchJson<T>(url: string, key: string, blankValue: T): Promise<DataResult<T>> {
    const now = Date.now();
    const cached = this.cache[key] as CacheEntry<T> | undefined;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data: T = await res.json();
      this.cache[key] = { data, timestamp: now };
      return { data, timestamp: now };
    } catch (err) {
      if (cached) return { data: cached.data, timestamp: cached.timestamp };
      return { data: blankValue, timestamp: now };
    }
  }
}
