'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import { Task } from '@/lib/types';
import { PRIORITY_CONFIG, STATUS_CONFIG, REVENUE_CONFIG } from '@/lib/constants';
import TaskComments from '@/components/tasks/TaskComments';
import Badge from '@/components/ui/Badge';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TaskDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { date } = useDate();
  const { daily, isLoading, toggleTask, mutate } = useDaily(date);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  const task = daily?.tasks.find(t => t.id === id) || daily?.recurringTasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-text-secondary">Task not found.</p>
        <Link href="/tasks" className="text-accent text-[13px] hover:underline mt-2 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const statusCfg = STATUS_CONFIG[task.status];
  const revenueCfg = REVENUE_CONFIG[task.revenueTag];

  const handleAddComment = async (text: string) => {
    await fetch(`/api/tasks/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date }),
    });
    mutate();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href="/tasks"
        className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to tasks
      </Link>

      <div className="bg-background border border-border-subtle rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              onChange={completed => toggleTask(task.id, completed)}
            />
          </div>
          <div className="flex-1">
            <h1 className={`text-lg font-semibold text-text-primary ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h1>
            {task.description && (
              <p className="text-[13px] text-text-secondary mt-1">{task.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {task.org && (
            <div>
              <span className="text-[11px] text-text-secondary block mb-1">Organization</span>
              <span className="text-[13px] text-text-primary font-medium">{task.org}</span>
            </div>
          )}
          <div>
            <span className="text-[11px] text-text-secondary block mb-1">Priority</span>
            <Badge color={priorityCfg.color} bg={priorityCfg.bg}>{priorityCfg.label}</Badge>
          </div>
          <div>
            <span className="text-[11px] text-text-secondary block mb-1">Status</span>
            <span className={`text-[13px] font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          <div>
            <span className="text-[11px] text-text-secondary block mb-1">Revenue</span>
            <Badge color={revenueCfg.color} bg={revenueCfg.bg}>{revenueCfg.label}</Badge>
          </div>
          {task.dueTime && (
            <div>
              <span className="text-[11px] text-text-secondary block mb-1">Due Time</span>
              <span className="text-[13px] text-text-primary">{task.dueTime}</span>
            </div>
          )}
          {task.carryCount > 0 && (
            <div>
              <span className="text-[11px] text-text-secondary block mb-1">Carry Count</span>
              <span className="text-[13px] text-amber-600 font-medium">{task.carryCount} times</span>
            </div>
          )}
        </div>

        <div className="border-t border-border-subtle pt-4">
          <TaskComments comments={task.comments} onAdd={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
