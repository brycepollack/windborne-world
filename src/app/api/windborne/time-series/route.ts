import { NextResponse } from 'next/server';
import { Controller } from '@/lib/controller';

export async function GET() {
  const result = await Controller.fetchTimeSeriesData();
  return NextResponse.json(result);
}
