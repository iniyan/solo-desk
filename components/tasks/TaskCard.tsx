'use client';

import { Task } from '@/lib/types';
import { PRIORITY_CONFIG } from '@/lib/constants';
import Checkbox from '../ui/Checkbox';
import Badge from '../ui/Badge';
import RevenueTag from './RevenueTag';
import { clsx } from 'clsx';
import { AlertTriangle, Clock, MessageSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (completed: boolean) => void;
  onClick?: () => void;
  compact?: boolean;
}

export default function TaskCard({ task, onToggle, onClick, compact = false }: TaskCardProps) {
  const priorityCfg = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={clsx(
        'group flex items-start gap-3 px-3 py-2.5 rounded-lg border border-transparent',
        'hover:bg-surface-hover hover:border-border-subtle transition-all cursor-pointer',
        task.completed && 'opacity-60'
      )}
      onClick={onClick}
    >
      <div className="pt-0.5" onClick={e => e.stopPropagation()}>
        <Checkbox checked={task.completed} onChange={onToggle} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'text-[13px] font-medium text-text-primary truncate',
              task.completed && 'line-through text-text-secondary'
            )}
          >
            {task.title}
          </span>
          {task.carryCount >= 3 && (
            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {task.org && (
              <span className="text-[11px] text-text-secondary">{task.org}</span>
            )}
            <Badge color={priorityCfg.color} bg={priorityCfg.bg}>
              {priorityCfg.label}
            </Badge>
            <RevenueTag tag={task.revenueTag} />
            {task.dueTime && (
              <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                <Clock size={10} />
                {task.dueTime}
              </span>
            )}
            {task.comments.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                <MessageSquare size={10} />
                {task.comments.length}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
