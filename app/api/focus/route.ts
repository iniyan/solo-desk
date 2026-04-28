import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ items: [] });

  return NextResponse.json({ items: data.focus3 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  data.focus3 = (body.items || []).slice(0, 3);
  await writeDailyFile(data);

  return NextResponse.json({ items: data.focus3 });
}
