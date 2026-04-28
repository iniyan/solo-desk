import { kv } from './kv';
import { RecurringTaskDef, Task } from './types';
import { v4 as uuid } from 'uuid';
import { getDay } from 'date-fns';

const CONFIG_KEY = 'config:recurring';

export async function getRecurringDefs(): Promise<RecurringTaskDef[]> {
  const defs = await kv.get<RecurringTaskDef[]>(CONFIG_KEY);
  return defs || [];
}

export function shouldRunToday(def: RecurringTaskDef, dateStr: string): boolean {
  if (!def.active) return false;

  const dayOfWeek = getDay(new Date(dateStr + 'T00:00:00'));

  switch (def.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekly':
      return dayOfWeek === 1; // Monday
    case 'custom':
      return def.customDays.includes(dayOfWeek);
    default:
      return false;
  }
}

export function createRecurringTask(def: RecurringTaskDef, dateStr: string): Task {
  return {
    id: uuid(),
    title: def.title,
    description: '',
    org: def.org,
    priority: def.priority,
    status: 'not-started',
    revenueTag: def.revenueTag,
    carryCount: 0,
    dueTime: '',
    comments: [],
    completed: false,
    createdDate: dateStr,
  };
}

export async function generateRecurringTasks(dateStr: string): Promise<Task[]> {
  const defs = await getRecurringDefs();
  return defs
    .filter(def => shouldRunToday(def, dateStr))
    .map(def => createRecurringTask(def, dateStr));
}
