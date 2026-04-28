'use client';

import { useState } from 'react';
import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskForm from '@/components/tasks/TaskForm';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Task } from '@/lib/types';
import { Plus, CheckSquare, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

type Tab = 'today' | 'recurring' | 'completed' | 'all';

export default function TasksPage() {
  const { date } = useDate();
  const { daily, isLoading, toggleTask, mutate } = useDaily(date);
  const { createTask } = useTasks(date);
  const [tab, setTab] = useState<Tab>('today');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({ org: '', priority: '', status: '', revenue: '' });

  const handleCreate = async (data: Partial<Task>) => {
    await createTask(data);
    setShowForm(false);
    mutate();
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!selectedTask) return;
    await fetch(`/api/tasks/${selectedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, date }),
    });
    setSelectedTask(null);
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

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'today', label: 'Today', count: daily.tasks.filter(t => !t.completed).length },
    { key: 'recurring', label: 'Recurring', count: daily.recurringTasks.length },
    { key: 'completed', label: 'Completed', count: [...daily.tasks, ...daily.recurringTasks].filter(t => t.completed).length },
    { key: 'all', label: 'All', count: daily.tasks.length + daily.recurringTasks.length },
  ];

  let displayTasks: Task[] = [];
  switch (tab) {
    case 'today':
      displayTasks = daily.tasks.filter(t => !t.completed);
      break;
    case 'recurring':
      displayTasks = daily.recurringTasks;
      break;
    case 'completed':
      displayTasks = [...daily.tasks, ...daily.recurringTasks].filter(t => t.completed);
      break;
    case 'all':
      displayTasks = [...daily.tasks, ...daily.recurringTasks];
      break;
  }

  // Apply filters
  if (filters.org) displayTasks = displayTasks.filter(t => t.org === filters.org);
  if (filters.priority) displayTasks = displayTasks.filter(t => t.priority === filters.priority);
  if (filters.status) displayTasks = displayTasks.filter(t => t.status === filters.status);
  if (filters.revenue) displayTasks = displayTasks.filter(t => t.revenueTag === filters.revenue);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Tasks</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={14} />
          New Task
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border-subtle">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'px-3 py-2 text-[13px] font-medium border-b-2 transition-colors -mb-px',
              tab === t.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            {t.label}
            <span className="ml-1.5 text-[11px] opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {displayTasks.length > 0 ? (
        <TaskList
          tasks={displayTasks}
          onToggle={toggleTask}
          onSelect={setSelectedTask}
        />
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks"
          description={tab === 'completed' ? 'No completed tasks yet.' : 'Create your first task to get started.'}
          action={tab !== 'completed' && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus size={12} /> Add Task
            </Button>
          )}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} title="New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Edit Task"
      >
        {selectedTask && (
          <TaskForm
            task={selectedTask}
            onSubmit={handleUpdate}
            onCancel={() => setSelectedTask(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
