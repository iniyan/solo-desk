import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { RecurringTaskDef } from '@/lib/types';
import { v4 as uuid } from 'uuid';

const CONFIG_KEY = 'config:recurring';

async function getRecurringTasks(): Promise<RecurringTaskDef[]> {
  const defs = await kv.get<RecurringTaskDef[]>(CONFIG_KEY);
  return defs || [];
}

export async function GET() {
  const tasks = await getRecurringTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tasks = await getRecurringTasks();

  const def: RecurringTaskDef = {
    id: uuid(),
    title: body.title || '',
    frequency: body.frequency || 'daily',
    customDays: body.customDays || [],
    org: body.org || '',
    priority: body.priority || 'medium',
    revenueTag: body.revenueTag || 'non-billable',
    active: body.active !== false,
  };

  tasks.push(def);
  await kv.set(CONFIG_KEY, tasks);

  return NextResponse.json(def, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const tasks = await getRecurringTasks();
  const idx = tasks.findIndex(t => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  tasks[idx] = { ...tasks[idx], ...body };
  await kv.set(CONFIG_KEY, tasks);

  return NextResponse.json(tasks[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const tasks = await getRecurringTasks();
  const updated = tasks.filter(t => t.id !== id);
  await kv.set(CONFIG_KEY, updated);

  return NextResponse.json({ success: true });
}
