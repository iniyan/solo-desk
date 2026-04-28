'use client';

import { Task } from '@/lib/types';
import { CheckCircle2, Circle } from 'lucide-react';

interface PendingTasksWidgetProps {
  tasks: Task[];
}

export default function PendingTasksWidget({ tasks }: PendingTasksWidgetProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">Task Progress</h3>

      <div className="flex items-end gap-6">
        <div>
          <div className="text-3xl font-bold text-text-primary">{completed}</div>
          <div className="text-[12px] text-text-secondary">completed</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-text-secondary">{pending}</div>
          <div className="text-[12px] text-text-secondary">pending</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-accent">{total}</div>
          <div className="text-[12px] text-text-secondary">total</div>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-4 h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
