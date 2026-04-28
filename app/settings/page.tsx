'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { RecurringTaskDef, Priority, RevenueTag, RecurringFrequency } from '@/lib/types';
import { PRIORITIES, REVENUE_TAGS } from '@/lib/constants';
import { PRIORITY_CONFIG, REVENUE_CONFIG } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Plus, Trash2, Repeat, Loader2, Pause, Play } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const FREQ_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekly', label: 'Weekly (Mon)' },
  { value: 'custom', label: 'Custom Days' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SettingsPage() {
  const { data: recurringTasks, mutate } = useSWR<RecurringTaskDef[]>('/api/recurring', fetcher);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<RecurringFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [org, setOrg] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [revenueTag, setRevenueTag] = useState<RevenueTag>('non-billable');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch('/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), frequency, customDays, org, priority, revenueTag }),
    });
    setTitle('');
    setFrequency('daily');
    setCustomDays([]);
    setOrg('');
    setPriority('medium');
    setRevenueTag('non-billable');
    setShowForm(false);
    mutate();
  };

  const handleToggle = async (def: RecurringTaskDef) => {
    await fetch('/api/recurring', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: def.id, active: !def.active }),
    });
    mutate();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/recurring?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const toggleDay = (day: number) => {
    setCustomDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-text-primary mb-2">Settings</h1>
      <p className="text-[13px] text-text-secondary mb-6">Manage recurring tasks and preferences.</p>

      <div className="bg-background border border-border-subtle rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Repeat size={16} className="text-accent" />
            <h2 className="text-[15px] font-semibold text-text-primary">Recurring Tasks</h2>
          </div>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={12} /> Add
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-surface rounded-lg p-4 mb-4 space-y-3">
            <Input
              id="rec-title"
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Check emails"
              required
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                id="frequency"
                label="Frequency"
                value={frequency}
                onChange={e => setFrequency(e.target.value as RecurringFrequency)}
                options={FREQ_OPTIONS}
              />
              <Input
                id="org"
                label="Organization"
                value={org}
                onChange={e => setOrg(e.target.value)}
                placeholder="Optional"
              />
              <Select
                id="priority"
                label="Priority"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                options={PRIORITIES.map(p => ({ value: p, label: PRIORITY_CONFIG[p].label }))}
              />
              <Select
                id="revenue"
                label="Revenue Tag"
                value={revenueTag}
                onChange={e => setRevenueTag(e.target.value as RevenueTag)}
                options={REVENUE_TAGS.map(r => ({ value: r, label: REVENUE_CONFIG[r].label }))}
              />
            </div>

            {frequency === 'custom' && (
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-2">Days</label>
                <div className="flex gap-2">
                  {DAY_NAMES.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`px-2.5 py-1 text-[12px] rounded-md border transition-colors ${
                        customDays.includes(idx)
                          ? 'bg-accent text-white border-accent'
                          : 'border-border-subtle text-text-secondary hover:border-accent'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" size="sm">Create</Button>
            </div>
          </form>
        )}

        {!recurringTasks ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-text-secondary" size={20} />
          </div>
        ) : recurringTasks.length === 0 ? (
          <p className="text-[13px] text-text-secondary text-center py-6">
            No recurring tasks. Add tasks that repeat daily, weekly, or on custom days.
          </p>
        ) : (
          <div className="space-y-2">
            {recurringTasks.map(def => {
              const priCfg = PRIORITY_CONFIG[def.priority];
              return (
                <div
                  key={def.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border-subtle ${!def.active ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-text-primary">{def.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-text-secondary capitalize">{def.frequency}</span>
                      {def.org && <span className="text-[11px] text-text-secondary">{def.org}</span>}
                      <Badge color={priCfg.color} bg={priCfg.bg}>{priCfg.label}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(def)}
                    className="p-1.5 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
                    title={def.active ? 'Pause' : 'Resume'}
                  >
                    {def.active ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(def.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
