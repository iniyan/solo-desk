import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const task = data.tasks.find(t => t.id === id) || data.recurringTasks.find(t => t.id === id);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const date = body.date || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Search in both tasks and recurring tasks
  let found = false;
  for (const list of [data.tasks, data.recurringTasks]) {
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...body,
        id, // preserve id
        comments: body.comments ?? list[idx].comments, // preserve comments unless explicitly set
      };
      if (body.completed !== undefined) {
        list[idx].status = body.completed ? 'completed' : list[idx].status === 'completed' ? 'not-started' : list[idx].status;
      }
      found = true;
      break;
    }
  }

  if (!found) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  await writeDailyFile(data);
  return NextResponse.json(data.tasks.find(t => t.id === id) || data.recurringTasks.find(t => t.id === id));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  data.tasks = data.tasks.filter(t => t.id !== id);
  data.recurringTasks = data.recurringTasks.filter(t => t.id !== id);

  await writeDailyFile(data);
  return NextResponse.json({ success: true });
}
