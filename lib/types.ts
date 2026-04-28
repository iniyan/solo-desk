export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not-started' | 'started' | 'in-progress' | 'completed' | 'carry-forward';
export type RevenueTag = 'billable' | 'non-billable' | 'growth' | 'admin';
export type RecurringFrequency = 'daily' | 'weekdays' | 'weekly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  org: string;
  priority: Priority;
  status: TaskStatus;
  revenueTag: RevenueTag;
  carryCount: number;
  dueTime: string;
  comments: Comment[];
  completed: boolean;
  createdDate: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

export interface InboxItem {
  id: string;
  text: string;
  capturedAt: string;
}

export interface TimeBlock {
  id: string;
  time: string;
  label: string;
  org: string;
}

export interface DailyData {
  date: string;
  focus3: string[];
  tasks: Task[];
  recurringTasks: Task[];
  inbox: InboxItem[];
  planner: TimeBlock[];
  notes: string;
  summary: DailySummary | null;
}

export interface DailySummary {
  completed: number;
  delayed: number;
  carried: number;
  topOrg: string;
  notes: string;
}

export interface Organization {
  slug: string;
  name: string;
  color: string;
  notes: string;
  activeTasks?: number;
  completionPercent?: number;
}

export interface TaskTemplate {
  slug: string;
  name: string;
  tasks: Array<{
    title: string;
    description: string;
    org: string;
    priority: Priority;
    revenueTag: RevenueTag;
  }>;
}

export interface RecurringTaskDef {
  id: string;
  title: string;
  frequency: RecurringFrequency;
  customDays: number[];
  org: string;
  priority: Priority;
  revenueTag: RevenueTag;
  active: boolean;
}

export interface WeeklyReview {
  weekStart: string;
  weekEnd: string;
  totalCompleted: number;
  totalDeferred: number;
  totalCarried: number;
  revenueBreakdown: Record<RevenueTag, number>;
  orgBreakdown: Record<string, { completed: number; total: number }>;
  topCarryForwards: Task[];
}

export interface AppConfig {
  dataDir: string;
  recurringTasks: RecurringTaskDef[];
  theme: 'light' | 'dark';
}
