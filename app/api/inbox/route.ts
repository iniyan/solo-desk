import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { v4 as uuid } from 'uuid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json([]);

  return NextResponse.json(data.inbox);
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();

  let data = await parseDailyFile(date);
  if (!data) {
    data = {
      date,
      focus3: [],
      tasks: [],
      recurringTasks: [],
      inbox: [],
      planner: [],
      notes: '',
      summary: null,
    };
  }

  const item = {
    id: uuid(),
    text: body.text || '',
    capturedAt: new Date().toISOString(),
  };

  data.inbox.push(item);
  await writeDailyFile(data);

  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const date = searchParams.get('date') || todayStr();

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  data.inbox = data.inbox.filter(item => item.id !== id);
  await writeDailyFile(data);

  return NextResponse.json({ success: true });
}
