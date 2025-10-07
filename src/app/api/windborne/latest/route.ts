import { NextResponse } from 'next/server';
import { Controller } from '@/lib/controller';

export const runtime = 'edge';

export async function GET() {
  const result = await Controller.fetchLatestData();
  return NextResponse.json(result);
}
