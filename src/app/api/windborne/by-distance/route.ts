// src/app/api/windborne/by-distance/route.ts
import { NextResponse } from 'next/server';
import * as turf from '@turf/turf';
import { Controller } from '@/lib/controller';

type DistanceData = [balloonId: number, kmTraveled: number][];

export async function GET() {
  const { data: latestData, timestamp: latestTimestamp } = await Controller.fetchLatestData();
  const { data: oldestData, timestamp: oldestTimestamp } = await Controller.fetchOldestData();

  if (!Array.isArray(latestData) || !Array.isArray(oldestData)) {
    return NextResponse.json({ error: 'Invalid upstream data format' }, { status: 500 });
  }

  const distances: DistanceData = [];

  const length = Math.min(latestData.length, oldestData.length);

  for (let i = 0; i < length; i++) {
    const latestPoint = latestData[i];
    const oldestPoint = oldestData[i];

    if (
      Array.isArray(latestPoint) &&
      Array.isArray(oldestPoint) &&
      typeof latestPoint[0] === 'number' &&
      typeof latestPoint[1] === 'number' &&
      typeof oldestPoint[0] === 'number' &&
      typeof oldestPoint[1] === 'number'
    ) {
      const from = turf.point([oldestPoint[1], oldestPoint[0]]);
      const to = turf.point([latestPoint[1], latestPoint[0]]);
      const km = turf.distance(from, to, { units: 'kilometers' });
      distances.push([i, km]);
    }
  }

  distances.sort((a, b) => b[1] - a[1]);

  console.log(`[windborne-by-distance] Computed distances for ${distances.length} balloons`);

  return NextResponse.json({ data: distances, timestamp: latestTimestamp });
}
