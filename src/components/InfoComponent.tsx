'use client';
import React, { useEffect, useState } from 'react';
import { Config } from '@/types/config';

// Types
type CountryData = [string, number];
type DistanceData = [number, number];
interface InfoComponentProps {
  config: Config;
}

// Shared fetch helper
async function fetchData<T>(url: string, parser: (raw: unknown) => T, blankValue: T): Promise<T> {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return parser(json.data ?? blankValue);
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return blankValue;
  }
}

// Parsers
const parseCountryData = (raw: unknown): CountryData[] =>
  (Array.isArray(raw) ? raw : []).filter(
    (entry): entry is CountryData =>
      Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'number',
  );

const parseDistanceData = (raw: unknown): DistanceData[] =>
  (Array.isArray(raw) ? raw : []).filter(
    (entry): entry is DistanceData =>
      Array.isArray(entry) && typeof entry[0] === 'number' && typeof entry[1] === 'number',
  );

export default function InfoComponent({ config }: InfoComponentProps) {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [distanceData, setDistanceData] = useState<DistanceData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    if (config.infoType === 'by-country') {
      fetchData('/api/windborne/by-country', parseCountryData, []).then(data => {
        setCountryData(data);
        setLastUpdated(Date.now());
      });
    } else {
      fetchData('/api/windborne/by-distance', parseDistanceData, []).then(data => {
        setDistanceData(data);
        setLastUpdated(Date.now());
      });
    }
  }, [config.infoType]);

  const dataToRender =
    config.infoType === 'by-country'
      ? countryData.map(([country, count]) => (
          <div key={country} className="mb-1">
            {country}: {count}
          </div>
        ))
      : distanceData.map(([balloonId, distanceKm]) => (
          <div key={balloonId} className="mb-1">
            Balloon {balloonId}: {distanceKm.toFixed(1)} km
          </div>
        ));

  return (
    <div className="h-full w-full bg-white bg-opacity-95 p-2 text-sm flex flex-col">
      <h4 className="mb-2 font-semibold shrink-0">
        {config.infoType === 'by-country'
          ? 'Balloons by Current Country (Last Hour)'
          : 'Balloons by Distance Travelled (Last 24 Hours)'}
      </h4>
      {lastUpdated && (
        <div className="mb-2 text-xs text-gray-500">
          Data as of: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
      <div className="overflow-y-auto">{dataToRender}</div>
    </div>
  );
}
