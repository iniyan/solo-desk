'use client';

import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import Focus3Widget from '@/components/dashboard/Focus3Widget';
import PendingTasksWidget from '@/components/dashboard/PendingTasksWidget';
import ProgressWidget from '@/components/dashboard/ProgressWidget';
import CalendarStrip from '@/components/dashboard/CalendarStrip';
import PlannerWidget from '@/components/dashboard/PlannerWidget';
import CarryForwardAlert from '@/components/dashboard/CarryForwardAlert';
import RevenueWidget from '@/components/dashboard/RevenueWidget';
import TaskList from '@/components/tasks/TaskList';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { date } = useDate();
  const { daily, isLoading, toggleTask, updateFocus3, mutate } = useDaily(date);

  const handleCarryAction = async (taskId: string, action: 'delete' | 'complete' | 'reset') => {
    await fetch('/api/carry-forward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, action, date }),
    });
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  if (!daily) return null;

  const allTasks = [...daily.tasks, ...daily.recurringTasks];
  const pendingTasks = allTasks.filter(t => !t.completed);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          <Focus3Widget items={daily.focus3} onUpdate={updateFocus3} />

          <CarryForwardAlert tasks={allTasks} onAction={handleCarryAction} />

          <div className="bg-background border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-text-primary">
                Pending Tasks ({pendingTasks.length})
              </h3>
            </div>
            <TaskList
              tasks={pendingTasks}
              onToggle={toggleTask}
            />
            {pendingTasks.length === 0 && (
              <p className="text-[13px] text-text-secondary py-4 text-center">
                All caught up! No pending tasks.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <CalendarStrip />
          <PendingTasksWidget tasks={allTasks} />
          <PlannerWidget blocks={daily.planner} />
          <ProgressWidget tasks={allTasks} />
          <RevenueWidget tasks={allTasks} />
        </div>
      </div>
    </div>
  );
}
