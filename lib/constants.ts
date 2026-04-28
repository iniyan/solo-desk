import { Priority, TaskStatus, RevenueTag } from './types';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-100' },
  high: { label: 'High', color: 'text-orange-700', bg: 'bg-orange-100' },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-100' },
  low: { label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  'not-started': { label: 'Not Yet Started', color: 'text-gray-500' },
  started: { label: 'Started', color: 'text-blue-600' },
  'in-progress': { label: 'In Progress', color: 'text-indigo-600' },
  completed: { label: 'Completed', color: 'text-emerald-600' },
  'carry-forward': { label: 'Carry Forward', color: 'text-amber-600' },
};

export const REVENUE_CONFIG: Record<RevenueTag, { label: string; color: string; bg: string }> = {
  billable: { label: 'Billable', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  'non-billable': { label: 'Non-Billable', color: 'text-gray-600', bg: 'bg-gray-100' },
  growth: { label: 'Growth', color: 'text-violet-700', bg: 'bg-violet-100' },
  admin: { label: 'Admin', color: 'text-amber-700', bg: 'bg-amber-100' },
};

export const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];
export const STATUSES: TaskStatus[] = ['not-started', 'started', 'in-progress', 'completed', 'carry-forward'];
export const REVENUE_TAGS: RevenueTag[] = ['billable', 'non-billable', 'growth', 'admin'];

export const CARRY_FORWARD_WARNING = 3;
export const CARRY_FORWARD_CRITICAL = 5;

export const DEFAULT_ORG_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];
