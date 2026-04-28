'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import { DailySummary, WeeklyReview, RevenueTag } from '@/lib/types';
import { REVENUE_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ReviewPage() {
  const { date } = useDate();
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  const { data: dailySummary, mutate: mutateSummary } = useSWR<DailySummary>(
    `/api/summary?date=${date}`,
    fetcher
  );

  const { data: weeklyReview } = useSWR<WeeklyReview>(
    tab === 'weekly' ? `/api/summary?type=weekly&date=${date}` : null,
    fetcher
  );

  const handleGenerate = async () => {
    await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    mutateSummary();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Review</h1>
        {tab === 'daily' && (
          <Button size="sm" onClick={handleGenerate}>
            <RefreshCw size={12} />
            Generate Summary
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border-subtle">
        {(['daily', 'weekly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-3 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px capitalize',
              tab === t
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            {t} Summary
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <>
          {dailySummary ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Completed" value={dailySummary.completed} color="text-emerald-600" />
              <StatCard label="Delayed" value={dailySummary.delayed} color="text-amber-600" />
              <StatCard label="Carried Forward" value={dailySummary.carried} color="text-red-500" />
              {dailySummary.topOrg && (
                <div className="sm:col-span-3 bg-background border border-border-subtle rounded-xl p-5">
                  <span className="text-[12px] text-text-secondary">Top Organization</span>
                  <p className="text-[15px] font-semibold text-text-primary mt-1">{dailySummary.topOrg}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={32} className="mx-auto text-text-secondary mb-3" />
              <p className="text-[13px] text-text-secondary">
                No summary generated yet. Click &quot;Generate Summary&quot; to create one.
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'weekly' && (
        <>
          {weeklyReview ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Completed" value={weeklyReview.totalCompleted} color="text-emerald-600" />
                <StatCard label="Total Deferred" value={weeklyReview.totalDeferred} color="text-amber-600" />
                <StatCard label="Total Carried" value={weeklyReview.totalCarried} color="text-red-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Breakdown */}
                <div className="bg-background border border-border-subtle rounded-xl p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-4">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    {(Object.entries(weeklyReview.revenueBreakdown) as [RevenueTag, number][]).map(([tag, count]) => {
                      const cfg = REVENUE_CONFIG[tag];
                      return (
                        <div key={tag}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[12px] text-text-primary">{cfg.label}</span>
                            <span className="text-[11px] text-text-secondary">{count}</span>
                          </div>
                          <ProgressBar value={count} max={weeklyReview.totalCompleted + weeklyReview.totalDeferred || 1} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Org Breakdown */}
                <div className="bg-background border border-border-subtle rounded-xl p-5">
                  <h3 className="text-[14px] font-semibold text-text-primary mb-4">By Organization</h3>
                  {Object.keys(weeklyReview.orgBreakdown).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(weeklyReview.orgBreakdown).map(([org, data]) => (
                        <div key={org}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[12px] text-text-primary">{org}</span>
                            <span className="text-[11px] text-text-secondary">
                              {data.completed}/{data.total}
                            </span>
                          </div>
                          <ProgressBar value={data.completed} max={data.total} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-text-secondary">No organization data.</p>
                  )}
                </div>

                {/* Carry Forward Issues */}
                {weeklyReview.topCarryForwards.length > 0 && (
                  <div className="lg:col-span-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                    <h3 className="text-[14px] font-semibold text-amber-800 dark:text-amber-400 mb-3">
                      Slipping Tasks
                    </h3>
                    <div className="space-y-2">
                      {weeklyReview.topCarryForwards.map(task => (
                        <div key={task.id} className="flex items-center gap-2">
                          <span className="text-[13px] text-text-primary">{task.title}</span>
                          <span className="text-[11px] text-amber-600">
                            ({task.carryCount}x carried)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-text-secondary" size={24} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <span className="text-[12px] text-text-secondary">{label}</span>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
