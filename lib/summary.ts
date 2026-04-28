import { DailyData, DailySummary, WeeklyReview, RevenueTag, Task } from './types';
import { parseDailyFile } from './markdown/parser';
import { getWeekDays } from './dates';

export function generateDailySummary(data: DailyData): DailySummary {
  const allTasks = [...data.tasks, ...data.recurringTasks];
  const completed = allTasks.filter(t => t.completed).length;
  const delayed = allTasks.filter(t => !t.completed && t.status === 'carry-forward').length;
  const carried = allTasks.filter(t => t.carryCount > 0).length;

  const orgCounts: Record<string, number> = {};
  allTasks.filter(t => t.completed && t.org).forEach(t => {
    orgCounts[t.org] = (orgCounts[t.org] || 0) + 1;
  });

  const topOrg = Object.entries(orgCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return { completed, delayed, carried, topOrg, notes: '' };
}

export async function generateWeeklyReview(dateStr: string): Promise<WeeklyReview> {
  const weekDays = getWeekDays(dateStr);

  let totalCompleted = 0;
  let totalDeferred = 0;
  let totalCarried = 0;
  const revenueBreakdown: Record<RevenueTag, number> = {
    billable: 0, 'non-billable': 0, growth: 0, admin: 0,
  };
  const orgBreakdown: Record<string, { completed: number; total: number }> = {};
  const allCarryForwards: Task[] = [];

  for (const day of weekDays) {
    const data = await parseDailyFile(day);
    if (!data) continue;

    const allTasks = [...data.tasks, ...data.recurringTasks];

    for (const task of allTasks) {
      if (task.org) {
        if (!orgBreakdown[task.org]) orgBreakdown[task.org] = { completed: 0, total: 0 };
        orgBreakdown[task.org].total++;
        if (task.completed) orgBreakdown[task.org].completed++;
      }

      revenueBreakdown[task.revenueTag]++;

      if (task.completed) totalCompleted++;
      if (task.status === 'carry-forward') totalDeferred++;
      if (task.carryCount >= 3) allCarryForwards.push(task);
    }

    totalCarried += allTasks.filter(t => t.carryCount > 0).length;
  }

  return {
    weekStart: weekDays[0],
    weekEnd: weekDays[weekDays.length - 1],
    totalCompleted,
    totalDeferred,
    totalCarried,
    revenueBreakdown,
    orgBreakdown,
    topCarryForwards: allCarryForwards,
  };
}
