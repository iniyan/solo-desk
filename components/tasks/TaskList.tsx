'use client';

import { Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onSelect?: (task: Task) => void;
  compact?: boolean;
}

export default function TaskList({ tasks, onToggle, onSelect, compact = false }: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={completed => onToggle(task.id, completed)}
          onClick={onSelect ? () => onSelect(task) : undefined}
          compact={compact}
        />
      ))}
    </div>
  );
}
