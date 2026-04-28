import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { DailyData, Task, InboxItem, TimeBlock, DailySummary, Comment, Priority, TaskStatus, RevenueTag } from '../types';
import { dailyFilePath } from '../data-path';
import { v4 as uuid } from 'uuid';

export async function parseDailyFile(dateStr: string): Promise<DailyData | null> {
  const filePath = dailyFilePath(dateStr);
  if (!existsSync(filePath)) return null;

  const content = await readFile(filePath, 'utf-8');
  return parseDailyContent(dateStr, content);
}

export function parseDailyContent(dateStr: string, content: string): DailyData {
  const sections = splitSections(content);

  return {
    date: dateStr,
    focus3: parseFocus3(sections['Focus 3'] || ''),
    tasks: parseTaskBlock(sections['Tasks'] || ''),
    recurringTasks: parseTaskBlock(sections['Recurring Tasks'] || ''),
    inbox: parseInbox(sections['Inbox'] || ''),
    planner: parsePlanner(sections['Planner'] || ''),
    notes: (sections['Notes'] || '').trim(),
    summary: parseSummary(sections['Summary'] || ''),
  };
}

function splitSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const regex = /^## (.+)$/gm;
  let match: RegExpExecArray | null;
  const matches: Array<{ name: string; index: number }> = [];

  while ((match = regex.exec(content)) !== null) {
    matches.push({ name: match[1].trim(), index: match.index + match[0].length });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index - matches[i + 1].name.length - 4 : content.length;
    sections[matches[i].name] = content.slice(start, end);
  }

  return sections;
}

function parseFocus3(section: string): string[] {
  return section
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => l.replace(/^- /, ''))
    .slice(0, 3);
}

function parseTaskBlock(section: string): Task[] {
  const tasks: Task[] = [];
  const lines = section.split('\n');
  let current: Partial<Task> | null = null;
  let currentComments: Comment[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    const taskMatch = trimmed.match(/^- \[([ x])\] (.+)$/);
    if (taskMatch) {
      if (current) {
        tasks.push(buildTask(current, currentComments));
      }
      current = {
        title: taskMatch[2],
        completed: taskMatch[1] === 'x',
        status: taskMatch[1] === 'x' ? 'completed' : 'not-started',
      };
      currentComments = [];
      continue;
    }

    if (current && trimmed) {
      const kvMatch = trimmed.match(/^(\w[\w\s]*?):\s*(.+)$/);
      if (kvMatch) {
        const key = kvMatch[1].trim();
        const value = kvMatch[2].trim();
        switch (key) {
          case 'Org': current.org = value; break;
          case 'Priority': current.priority = value.toLowerCase() as Priority; break;
          case 'Status': current.status = parseStatus(value); break;
          case 'Revenue': current.revenueTag = value.toLowerCase().replace(' ', '-') as RevenueTag; break;
          case 'CarryCount': current.carryCount = parseInt(value, 10) || 0; break;
          case 'Id': current.id = value; break;
          case 'DueTime': current.dueTime = value; break;
          case 'Description': current.description = value; break;
          case 'CreatedDate': current.createdDate = value; break;
          case 'Comment': {
            const commentMatch = value.match(/^\[(.+?)\] (.+)$/);
            if (commentMatch) {
              currentComments.push({
                id: uuid(),
                timestamp: commentMatch[1],
                text: commentMatch[2],
              });
            }
            break;
          }
        }
      }
    }
  }

  if (current) {
    tasks.push(buildTask(current, currentComments));
  }

  return tasks;
}

function parseStatus(value: string): TaskStatus {
  const map: Record<string, TaskStatus> = {
    'not yet started': 'not-started',
    'not started': 'not-started',
    'not-started': 'not-started',
    'started': 'started',
    'in progress': 'in-progress',
    'in-progress': 'in-progress',
    'completed': 'completed',
    'carry forward': 'carry-forward',
    'carry-forward': 'carry-forward',
    'carry forward to tomorrow': 'carry-forward',
  };
  return map[value.toLowerCase()] || 'not-started';
}

function buildTask(partial: Partial<Task>, comments: Comment[]): Task {
  return {
    id: partial.id || uuid(),
    title: partial.title || '',
    description: partial.description || '',
    org: partial.org || '',
    priority: partial.priority || 'medium',
    status: partial.completed ? 'completed' : (partial.status || 'not-started'),
    revenueTag: partial.revenueTag || 'non-billable',
    carryCount: partial.carryCount || 0,
    dueTime: partial.dueTime || '',
    comments,
    completed: partial.completed || false,
    createdDate: partial.createdDate || '',
  };
}

function parseInbox(section: string): InboxItem[] {
  return section
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => {
      const text = l.replace(/^- /, '');
      const idMatch = text.match(/\[id:(.+?)\]/);
      const atMatch = text.match(/\[at:(.+?)\]/);
      return {
        id: idMatch ? idMatch[1] : uuid(),
        text: text.replace(/\s*\[id:.+?\]/g, '').replace(/\s*\[at:.+?\]/g, '').trim(),
        capturedAt: atMatch ? atMatch[1] : new Date().toISOString(),
      };
    });
}

function parsePlanner(section: string): TimeBlock[] {
  return section
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^\d/.test(l))
    .map(l => {
      const match = l.match(/^(\d{1,2}:\d{2})\s+(.+?)(?:\s+\[org:(.+?)\])?$/);
      if (!match) return null;
      return {
        id: uuid(),
        time: match[1],
        label: match[2].trim(),
        org: match[3]?.trim() || '',
      };
    })
    .filter((b): b is TimeBlock => b !== null);
}

function parseSummary(section: string): DailySummary | null {
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const data: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(/^(\w[\w\s]*?):\s*(.+)$/);
    if (match) data[match[1].trim()] = match[2].trim();
  }

  if (!data['Completed']) return null;

  return {
    completed: parseInt(data['Completed'], 10) || 0,
    delayed: parseInt(data['Delayed'], 10) || 0,
    carried: parseInt(data['Carried'], 10) || 0,
    topOrg: data['Top Org'] || '',
    notes: data['Notes'] || '',
  };
}
