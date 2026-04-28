'use client';

import { useState } from 'react';
import { Task, Priority, RevenueTag, TaskStatus } from '@/lib/types';
import { PRIORITIES, REVENUE_TAGS, STATUSES } from '@/lib/constants';
import { PRIORITY_CONFIG, REVENUE_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useOrganizations } from '@/hooks/useOrganizations';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const { organizations } = useOrganizations();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [org, setOrg] = useState(task?.org || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'not-started');
  const [revenueTag, setRevenueTag] = useState<RevenueTag>(task?.revenueTag || 'non-billable');
  const [dueTime, setDueTime] = useState(task?.dueTime || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      org,
      priority,
      status,
      revenueTag,
      dueTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        required
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-[13px] font-medium text-text-primary">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={2}
          className="w-full px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="org"
          label="Organization"
          value={org}
          onChange={e => setOrg(e.target.value)}
          options={[
            { value: '', label: 'None' },
            ...organizations.map(o => ({ value: o.name, label: o.name })),
          ]}
        />

        <Select
          id="priority"
          label="Priority"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          options={PRIORITIES.map(p => ({ value: p, label: PRIORITY_CONFIG[p].label }))}
        />

        <Select
          id="status"
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value as TaskStatus)}
          options={STATUSES.map(s => ({ value: s, label: STATUS_CONFIG[s].label }))}
        />

        <Select
          id="revenue"
          label="Revenue Tag"
          value={revenueTag}
          onChange={e => setRevenueTag(e.target.value as RevenueTag)}
          options={REVENUE_TAGS.map(r => ({ value: r, label: REVENUE_CONFIG[r].label }))}
        />
      </div>

      <Input
        id="dueTime"
        label="Due Time"
        type="time"
        value={dueTime}
        onChange={e => setDueTime(e.target.value)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
