import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { Task } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json([]);

  let tasks = data.tasks;

  const org = searchParams.get('org');
  if (org) tasks = tasks.filter(t => t.org === org);

  const priority = searchParams.get('priority');
  if (priority) tasks = tasks.filter(t => t.priority === priority);

  const status = searchParams.get('status');
  if (status) tasks = tasks.filter(t => t.status === status);

  const revenue = searchParams.get('revenue');
  if (revenue) tasks = tasks.filter(t => t.revenueTag === revenue);

  return NextResponse.json(tasks);
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

  const task: Task = {
    id: uuid(),
    title: body.title || '',
    description: body.description || '',
    org: body.org || '',
    priority: body.priority || 'medium',
    status: body.status || 'not-started',
    revenueTag: body.revenueTag || 'non-billable',
    carryCount: 0,
    dueTime: body.dueTime || '',
    comments: [],
    completed: false,
    createdDate: date,
  };

  data.tasks.push(task);
  await writeDailyFile(data);

  return NextResponse.json(task, { status: 201 });
}
