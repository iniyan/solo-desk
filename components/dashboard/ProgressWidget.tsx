'use client';

import { Task } from '@/lib/types';
import ProgressBar from '../ui/ProgressBar';

interface ProgressWidgetProps {
  tasks: Task[];
}

export default function ProgressWidget({ tasks }: ProgressWidgetProps) {
  const orgMap: Record<string, { total: number; completed: number }> = {};

  tasks.forEach(t => {
    const key = t.org || 'Unassigned';
    if (!orgMap[key]) orgMap[key] = { total: 0, completed: 0 };
    orgMap[key].total++;
    if (t.completed) orgMap[key].completed++;
  });

  const entries = Object.entries(orgMap).sort((a, b) => b[1].total - a[1].total);

  if (entries.length === 0) return null;

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">By Organization</h3>
      <div className="space-y-3">
        {entries.map(([org, data]) => (
          <div key={org}>
            <div className="flex justify-between mb-1">
              <span className="text-[12px] font-medium text-text-primary">{org}</span>
              <span className="text-[11px] text-text-secondary">
                {data.completed}/{data.total}
              </span>
            </div>
            <ProgressBar value={data.completed} max={data.total} />
          </div>
        ))}
      </div>
    </div>
  );
}
