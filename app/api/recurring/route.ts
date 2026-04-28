import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { configFilePath } from '@/lib/data-path';
import { RecurringTaskDef } from '@/lib/types';
import { v4 as uuid } from 'uuid';

async function readConfig() {
  const cfgPath = configFilePath();
  if (!existsSync(cfgPath)) return { recurringTasks: [], theme: 'light' };
  const content = await readFile(cfgPath, 'utf-8');
  return JSON.parse(content);
}

async function saveConfig(config: Record<string, unknown>) {
  await writeFile(configFilePath(), JSON.stringify(config, null, 2), 'utf-8');
}

export async function GET() {
  const config = await readConfig();
  return NextResponse.json(config.recurringTasks || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const config = await readConfig();

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

  config.recurringTasks = [...(config.recurringTasks || []), def];
  await saveConfig(config);

  return NextResponse.json(def, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const config = await readConfig();

  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const tasks = config.recurringTasks || [];
  const idx = tasks.findIndex((t: RecurringTaskDef) => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  tasks[idx] = { ...tasks[idx], ...body };
  config.recurringTasks = tasks;
  await saveConfig(config);

  return NextResponse.json(tasks[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const config = await readConfig();
  config.recurringTasks = (config.recurringTasks || []).filter((t: RecurringTaskDef) => t.id !== id);
  await saveConfig(config);

  return NextResponse.json({ success: true });
}
