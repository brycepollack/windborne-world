import { BalloonPoint, BalloonSeries, isBalloonPoint, DataResult } from '@/types/data';
import { Fetcher } from '@/lib/fetcher';

export class Controller {
  static async fetchLatestData(): Promise<DataResult<BalloonPoint[]>> {
    const result = await Fetcher.fetchJson<unknown[]>(
      'https://a.windbornesystems.com/treasure/00.json',
      'latest',
      [],
    );
    const points = Array.isArray(result.data) ? result.data.filter(isBalloonPoint) : [];
    return { data: points, timestamp: result.timestamp };
  }

  static async fetchOldestData(): Promise<DataResult<BalloonPoint[]>> {
    const result = await Fetcher.fetchJson<unknown[]>(
      'https://a.windbornesystems.com/treasure/23.json',
      'oldest',
      [],
    );
    const points = Array.isArray(result.data) ? result.data.filter(isBalloonPoint) : [];
    return { data: points, timestamp: result.timestamp };
  }

  static async fetchTimeSeriesData(): Promise<DataResult<BalloonSeries>> {
    const balloonTrails: BalloonSeries = {};
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

    const hourResults = await Promise.all(
      hours.map(hour =>
        Fetcher.fetchJson<unknown[]>(
          `https://a.windbornesystems.com/treasure/${hour}.json`,
          `timeSeries-hour-${hour}`,
          [],
        ),
      ),
    );

    hourResults.forEach(res => {
      res.data.forEach((point, idx) => {
        if (isBalloonPoint(point)) {
          if (!balloonTrails[idx]) balloonTrails[idx] = [];
          balloonTrails[idx].push(point);
        }
      });
    });

    return { data: balloonTrails, timestamp: Date.now() };
  }
}
