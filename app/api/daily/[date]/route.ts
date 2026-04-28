import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { getCarryForwardTasks } from '@/lib/carry-forward';
import { generateRecurringTasks } from '@/lib/recurring';
import { DailyData } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  let data = await parseDailyFile(date);

  if (!data) {
    const carried = await getCarryForwardTasks(date);
    const recurring = await generateRecurringTasks(date);

    data = {
      date,
      focus3: [],
      tasks: carried,
      recurringTasks: recurring,
      inbox: [],
      planner: [],
      notes: '',
      summary: null,
    };

    await writeDailyFile(data);
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const body = await request.json();

  const existing = await parseDailyFile(date);
  const data: DailyData = {
    date,
    focus3: body.focus3 ?? existing?.focus3 ?? [],
    tasks: body.tasks ?? existing?.tasks ?? [],
    recurringTasks: body.recurringTasks ?? existing?.recurringTasks ?? [],
    inbox: body.inbox ?? existing?.inbox ?? [],
    planner: body.planner ?? existing?.planner ?? [],
    notes: body.notes ?? existing?.notes ?? '',
    summary: body.summary ?? existing?.summary ?? null,
  };

  await writeDailyFile(data);
  return NextResponse.json(data);
}
