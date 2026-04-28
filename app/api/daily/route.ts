import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { getCarryForwardTasks } from '@/lib/carry-forward';
import { generateRecurringTasks } from '@/lib/recurring';
import { todayStr } from '@/lib/dates';
import { DailyData } from '@/lib/types';

export async function GET() {
  const date = todayStr();
  let data = await parseDailyFile(date);

  if (!data) {
    // Create today's file with carry-forwards and recurring tasks
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

export async function POST(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();

  const carried = await getCarryForwardTasks(date);
  const recurring = await generateRecurringTasks(date);

  const data: DailyData = {
    date,
    focus3: body.focus3 || [],
    tasks: [...carried, ...(body.tasks || [])],
    recurringTasks: recurring,
    inbox: body.inbox || [],
    planner: body.planner || [],
    notes: body.notes || '',
    summary: null,
  };

  await writeDailyFile(data);
  return NextResponse.json(data);
}
