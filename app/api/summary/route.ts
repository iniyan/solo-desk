import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { generateDailySummary, generateWeeklyReview } from '@/lib/summary';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'daily';
  const date = searchParams.get('date') || todayStr();

  if (type === 'weekly') {
    const review = await generateWeeklyReview(date);
    return NextResponse.json(review);
  }

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  return NextResponse.json(data.summary || generateDailySummary(data));
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  const summary = generateDailySummary(data);
  if (body.notes) summary.notes = body.notes;

  data.summary = summary;
  await writeDailyFile(data);

  return NextResponse.json(summary);
}
