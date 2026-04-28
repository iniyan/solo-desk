'use client';

import { Task, RevenueTag } from '@/lib/types';
import { REVENUE_CONFIG } from '@/lib/constants';

interface RevenueWidgetProps {
  tasks: Task[];
}

export default function RevenueWidget({ tasks }: RevenueWidgetProps) {
  const counts: Record<RevenueTag, number> = {
    billable: 0,
    'non-billable': 0,
    growth: 0,
    admin: 0,
  };

  tasks.forEach(t => {
    counts[t.revenueTag]++;
  });

  const total = tasks.length || 1;
  const entries = (Object.entries(counts) as [RevenueTag, number][]).filter(([, v]) => v > 0);

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">Revenue Split</h3>

      {entries.length === 0 ? (
        <p className="text-[13px] text-text-secondary">No tasks yet.</p>
      ) : (
        <>
          <div className="flex h-3 rounded-full overflow-hidden mb-4">
            {entries.map(([tag, count]) => {
              const colors: Record<RevenueTag, string> = {
                billable: 'bg-emerald-500',
                'non-billable': 'bg-gray-400',
                growth: 'bg-violet-500',
                admin: 'bg-amber-500',
              };
              return (
                <div
                  key={tag}
                  className={`${colors[tag]} transition-all duration-300`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {entries.map(([tag, count]) => {
              const cfg = REVENUE_CONFIG[tag];
              return (
                <div key={tag} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm ${cfg.bg}`} />
                  <span className="text-[12px] text-text-secondary">{cfg.label}</span>
                  <span className="text-[12px] font-medium text-text-primary ml-auto">{count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
