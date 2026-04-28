import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { v4 as uuid } from 'uuid';
import { TimeBlock } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json([]);

  return NextResponse.json(data.planner);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  if (body.blocks) {
    data.planner = body.blocks;
  } else if (body.block) {
    const block: TimeBlock = {
      id: body.block.id || uuid(),
      time: body.block.time,
      label: body.block.label,
      org: body.block.org || '',
    };
    const idx = data.planner.findIndex(b => b.id === block.id);
    if (idx !== -1) {
      data.planner[idx] = block;
    } else {
      data.planner.push(block);
      data.planner.sort((a, b) => a.time.localeCompare(b.time));
    }
  }

  await writeDailyFile(data);
  return NextResponse.json(data.planner);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const date = searchParams.get('date') || todayStr();

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  data.planner = data.planner.filter(b => b.id !== id);
  await writeDailyFile(data);

  return NextResponse.json({ success: true });
}
