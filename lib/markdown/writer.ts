import { writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';
import { DailyData, Task, InboxItem, TimeBlock, DailySummary } from '../types';
import { dailyFilePath } from '../data-path';

export async function writeDailyFile(data: DailyData): Promise<void> {
  const filePath = dailyFilePath(data.date);
  await mkdir(path.dirname(filePath), { recursive: true });

  const content = serializeDaily(data);
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, content, 'utf-8');
  await rename(tmpPath, filePath);
}

export function serializeDaily(data: DailyData): string {
  const parts: string[] = [];

  parts.push(`# Date: ${data.date}`);
  parts.push('');

  // Focus 3
  parts.push('## Focus 3');
  if (data.focus3.length > 0) {
    data.focus3.forEach(item => parts.push(`- ${item}`));
  }
  parts.push('');

  // Tasks
  parts.push('## Tasks');
  if (data.tasks.length > 0) {
    data.tasks.forEach((task, i) => {
      if (i > 0) parts.push('');
      parts.push(...serializeTask(task));
    });
  }
  parts.push('');

  // Recurring Tasks
  parts.push('## Recurring Tasks');
  if (data.recurringTasks.length > 0) {
    data.recurringTasks.forEach((task, i) => {
      if (i > 0) parts.push('');
      parts.push(...serializeTask(task));
    });
  }
  parts.push('');

  // Inbox
  parts.push('## Inbox');
  if (data.inbox.length > 0) {
    data.inbox.forEach(item => parts.push(serializeInboxItem(item)));
  }
  parts.push('');

  // Planner
  parts.push('## Planner');
  if (data.planner.length > 0) {
    data.planner.forEach(block => parts.push(serializeTimeBlock(block)));
  }
  parts.push('');

  // Notes
  parts.push('## Notes');
  if (data.notes) parts.push(data.notes);
  parts.push('');

  // Summary
  parts.push('## Summary');
  if (data.summary) {
    parts.push(...serializeSummary(data.summary));
  }
  parts.push('');

  return parts.join('\n');
}

function serializeTask(task: Task): string[] {
  const checkbox = task.completed ? '[x]' : '[ ]';
  const lines: string[] = [`- ${checkbox} ${task.title}`];

  if (task.id) lines.push(`  Id: ${task.id}`);
  if (task.org) lines.push(`  Org: ${task.org}`);
  lines.push(`  Priority: ${capitalize(task.priority)}`);
  lines.push(`  Status: ${formatStatus(task.status)}`);
  lines.push(`  Revenue: ${formatRevenue(task.revenueTag)}`);
  if (task.carryCount > 0) lines.push(`  CarryCount: ${task.carryCount}`);
  if (task.dueTime) lines.push(`  DueTime: ${task.dueTime}`);
  if (task.description) lines.push(`  Description: ${task.description}`);
  if (task.createdDate) lines.push(`  CreatedDate: ${task.createdDate}`);

  task.comments.forEach(c => {
    lines.push(`  Comment: [${c.timestamp}] ${c.text}`);
  });

  return lines;
}

function serializeInboxItem(item: InboxItem): string {
  return `- ${item.text} [id:${item.id}] [at:${item.capturedAt}]`;
}

function serializeTimeBlock(block: TimeBlock): string {
  const org = block.org ? ` [org:${block.org}]` : '';
  return `${block.time} ${block.label}${org}`;
}

function serializeSummary(summary: DailySummary): string[] {
  const lines: string[] = [];
  lines.push(`Completed: ${summary.completed}`);
  lines.push(`Delayed: ${summary.delayed}`);
  lines.push(`Carried: ${summary.carried}`);
  if (summary.topOrg) lines.push(`Top Org: ${summary.topOrg}`);
  if (summary.notes) lines.push(`Notes: ${summary.notes}`);
  return lines;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    'not-started': 'Not Yet Started',
    started: 'Started',
    'in-progress': 'In Progress',
    completed: 'Completed',
    'carry-forward': 'Carry Forward',
  };
  return map[status] || status;
}

function formatRevenue(tag: string): string {
  const map: Record<string, string> = {
    billable: 'Billable',
    'non-billable': 'Non-Billable',
    growth: 'Growth',
    admin: 'Admin',
  };
  return map[tag] || tag;
}
