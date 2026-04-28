import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { v4 as uuid } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json([]);

  const task = data.tasks.find(t => t.id === id) || data.recurringTasks.find(t => t.id === id);
  return NextResponse.json(task?.comments || []);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const date = body.date || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const task = data.tasks.find(t => t.id === id) || data.recurringTasks.find(t => t.id === id);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const comment = {
    id: uuid(),
    text: body.text,
    timestamp: new Date().toISOString(),
  };

  task.comments.push(comment);
  await writeDailyFile(data);

  return NextResponse.json(comment, { status: 201 });
}
