'use client';

import { Task } from '@/lib/types';
import { AlertTriangle, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { CARRY_FORWARD_WARNING, CARRY_FORWARD_CRITICAL } from '@/lib/constants';

interface CarryForwardAlertProps {
  tasks: Task[];
  onAction: (taskId: string, action: 'delete' | 'complete' | 'reset') => void;
}

export default function CarryForwardAlert({ tasks, onAction }: CarryForwardAlertProps) {
  const flagged = tasks.filter(t => t.carryCount >= CARRY_FORWARD_WARNING && !t.completed);

  if (flagged.length === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-amber-600" />
        <h3 className="text-[14px] font-semibold text-amber-800 dark:text-amber-400">
          Carry Forward Alerts
        </h3>
      </div>

      <div className="space-y-2">
        {flagged.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-medium text-text-primary truncate block">
                {task.title}
              </span>
              <span className="text-[11px] text-amber-600">
                Carried forward {task.carryCount} times
                {task.carryCount >= CARRY_FORWARD_CRITICAL && ' — consider deleting or doing it now'}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onAction(task.id, 'complete')}
                className="p-1.5 rounded-md hover:bg-emerald-100 text-emerald-600 transition-colors"
                title="Mark complete"
              >
                <CheckCircle2 size={14} />
              </button>
              <button
                onClick={() => onAction(task.id, 'reset')}
                className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                title="Reset carry count"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => onAction(task.id, 'delete')}
                className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
