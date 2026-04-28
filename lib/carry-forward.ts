import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { parseDailyFile } from './markdown/parser';
import { Task } from './types';
import { format, subDays } from 'date-fns';

export async function getIncompleteTasks(dateStr: string): Promise<Task[]> {
  const data = await parseDailyFile(dateStr);
  if (!data) return [];

  return data.tasks.filter(t => !t.completed && t.status !== 'completed');
}

export async function findPreviousDay(dateStr: string, maxLookback = 7): Promise<string | null> {
  for (let i = 1; i <= maxLookback; i++) {
    const prev = format(subDays(new Date(dateStr + 'T00:00:00'), i), 'yyyy-MM-dd');
    const data = await parseDailyFile(prev);
    if (data) return prev;
  }
  return null;
}

export async function getCarryForwardTasks(dateStr: string): Promise<Task[]> {
  const prevDay = await findPreviousDay(dateStr);
  if (!prevDay) return [];

  const incomplete = await getIncompleteTasks(prevDay);
  return incomplete.map(t => ({
    ...t,
    carryCount: t.carryCount + 1,
    status: 'not-started' as const,
    completed: false,
  }));
}

export interface CarryForwardAlert {
  task: Task;
  level: 'warning' | 'critical';
  suggestion: string;
}

export function analyzeCarryForwards(tasks: Task[]): CarryForwardAlert[] {
  return tasks
    .filter(t => t.carryCount >= 3)
    .map(t => ({
      task: t,
      level: t.carryCount >= 5 ? 'critical' as const : 'warning' as const,
      suggestion: t.carryCount >= 5
        ? 'This task has been carried forward 5+ times. Consider: delete it, delegate it, or do it now.'
        : 'This task has been carried forward 3+ times. Consider prioritizing it.',
    }));
}
