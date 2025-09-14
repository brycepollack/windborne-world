import { NextResponse } from 'next/server';
import { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import { Controller } from '@/lib/controller';
import worldData from '@/data/world.json';
import * as turf from '@turf/turf';

const world = worldData as FeatureCollection<
  Polygon | MultiPolygon,
  {
    NAME: string;
    NAME_LONG: string;
    ADM0_A3: string;
    ISO_A2: string;
    ISO_A3: string;
    WB_A2: string;
    WB_A3: string;
  }
>;

export async function GET() {
  const { data: points, timestamp } = await Controller.fetchLatestData();

  if (!Array.isArray(points)) {
    return NextResponse.json({ data: [], timestamp });
  }

  const counts: Record<string, number> = {};

  for (const point of points) {
    if (!Array.isArray(point) || typeof point[0] !== 'number' || typeof point[1] !== 'number')
      continue;

    const pt = turf.point([point[1], point[0]]);
    for (const feature of world.features) {
      if (turf.booleanPointInPolygon(pt, feature)) {
        const country = feature.properties?.NAME ?? 'Unknown';
        counts[country] = (counts[country] || 0) + 1;
        break;
      }
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  console.log(`[windborne-by-country] Computed counts for ${counts.length} countries`);

  return NextResponse.json({ data: sorted, timestamp });
}
