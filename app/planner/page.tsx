'use client';

import { useState } from 'react';
import { useDate } from '@/hooks/useDate';
import { usePlanner } from '@/hooks/usePlanner';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { CalendarClock, Plus, Trash2, Loader2 } from 'lucide-react';

export default function PlannerPage() {
  const { date } = useDate();
  const { blocks, isLoading, addBlock, removeBlock } = usePlanner(date);
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [org, setOrg] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !label.trim()) return;
    await addBlock({ time, label: label.trim(), org });
    setTime('');
    setLabel('');
    setOrg('');
    setShowForm(false);
  };

  // Generate hour slots from 6am to 10pm
  const hours = Array.from({ length: 17 }, (_, i) => {
    const h = i + 6;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Daily Planner</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={14} />
          Add Block
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-surface border border-border-subtle rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Label</label>
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g., Client call"
                required
                className="w-full px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1">Org (optional)</label>
              <input
                type="text"
                value={org}
                onChange={e => setOrg(e.target.value)}
                placeholder="Organization"
                className="w-full px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Add</Button>
          </div>
        </form>
      )}

      <div className="relative">
        {hours.map(hour => {
          const hourBlocks = blocks.filter(b => b.time.startsWith(hour.split(':')[0]));
          return (
            <div key={hour} className="flex min-h-[48px] border-t border-border-subtle">
              <div className="w-16 py-2 text-[12px] font-mono text-text-secondary flex-shrink-0">
                {hour}
              </div>
              <div className="flex-1 py-1 px-2">
                {hourBlocks.map(block => (
                  <div
                    key={block.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border-l-2 border-accent rounded-r-lg mb-1 group"
                  >
                    <span className="text-[12px] font-mono text-accent">{block.time}</span>
                    <span className="text-[13px] text-text-primary flex-1">{block.label}</span>
                    {block.org && (
                      <span className="text-[11px] text-text-secondary">{block.org}</span>
                    )}
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-text-secondary hover:text-red-500 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {blocks.length === 0 && !showForm && (
        <EmptyState
          icon={CalendarClock}
          title="No time blocks"
          description="Plan your day by adding time blocks for calls, meetings, and focus time."
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus size={12} /> Add Block
            </Button>
          }
        />
      )}
    </div>
  );
}
