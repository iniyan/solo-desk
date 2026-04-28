import { NextResponse } from 'next/server';
import { parseDailyFile } from '@/lib/markdown/parser';
import { writeDailyFile } from '@/lib/markdown/writer';
import { todayStr } from '@/lib/dates';
import { analyzeCarryForwards } from '@/lib/carry-forward';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayStr();

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json([]);

  const alerts = analyzeCarryForwards([...data.tasks, ...data.recurringTasks]);
  return NextResponse.json(alerts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const date = body.date || todayStr();
  const { taskId, action } = body;

  if (!taskId || !action) {
    return NextResponse.json({ error: 'Missing taskId or action' }, { status: 400 });
  }

  const data = await parseDailyFile(date);
  if (!data) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  for (const list of [data.tasks, data.recurringTasks]) {
    const idx = list.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      switch (action) {
        case 'delete':
          list.splice(idx, 1);
          break;
        case 'reset':
          list[idx].carryCount = 0;
          break;
        case 'complete':
          list[idx].completed = true;
          list[idx].status = 'completed';
          break;
      }
      break;
    }
  }

  await writeDailyFile(data);
  return NextResponse.json({ success: true });
}
