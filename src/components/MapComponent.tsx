'use client';
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Config } from '@/types/config';

// Types
type BalloonPoint = [number, number];
type BalloonTrail = { id: number; path: BalloonPoint[] };
interface MapComponentProps {
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
const parsePoints = (raw: unknown): BalloonPoint[] =>
  Array.isArray(raw)
    ? raw.filter(
        (p): p is BalloonPoint =>
          Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number',
      )
    : [];

const parseTrails = (raw: unknown): BalloonTrail[] =>
  raw && typeof raw === 'object'
    ? Object.entries(raw as Record<string, BalloonPoint[]>).map(([id, path]) => ({
        id: Number(id),
        path: path.filter(
          (p): p is BalloonPoint =>
            Array.isArray(p) &&
            p.length >= 2 &&
            typeof p[0] === 'number' &&
            typeof p[1] === 'number',
        ),
      }))
    : [];

export default function MapComponent({ config }: MapComponentProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [points, setPoints] = useState<BalloonPoint[]>([]);
  const [trails, setTrails] = useState<BalloonTrail[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const containerStyle = { width: '100%', height: '100%' };
  const center = { lat: 0, lng: 0 };

  useEffect(() => {
    fetchData('/api/windborne/latest', parsePoints, []).then(data => {
      setPoints(data);
      setLastUpdated(Date.now());
    });

    fetchData('/api/windborne/time-series', parseTrails, []).then(data => {
      setTrails(data);
      setLastUpdated(prev => Math.max(prev ?? 0, Date.now()));
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        options={{ streetViewControl: false }}
        onLoad={map => {
          mapRef.current = map;
        }}
      >
        {points.map((p, idx) => (
          <Marker
            key={idx}
            position={{ lat: p[0], lng: p[1] }}
            label={
              config.showIds
                ? {
                    text: `${idx}`,
                    color: 'black',
                    fontSize: `${config.idSize}px`,
                    fontWeight: 'bold',
                  }
                : undefined
            }
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: config.balloonSize,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeWeight: 0,
            }}
          />
        ))}

        {trails.map(trail => (
          <Polyline
            key={trail.id}
            path={trail.path.map(p => ({ lat: p[0], lng: p[1] }))}
            options={{
              strokeColor: '#0000FF',
              strokeOpacity: 0.3,
              strokeWeight: config.balloonSize,
              visible: config.showTrails,
            }}
          />
        ))}

        {lastUpdated && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'white',
              padding: '2px 6px',
              fontSize: 10,
            }}
          >
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
