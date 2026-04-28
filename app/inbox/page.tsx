'use client';

import { useState } from 'react';
import { useDate } from '@/hooks/useDate';
import { useInbox } from '@/hooks/useInbox';
import { useTasks } from '@/hooks/useTasks';
import { useDaily } from '@/hooks/useDaily';
import Dialog from '@/components/ui/Dialog';
import TaskForm from '@/components/tasks/TaskForm';
import EmptyState from '@/components/ui/EmptyState';
import { Task } from '@/lib/types';
import { Inbox, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function InboxPage() {
  const { date } = useDate();
  const { items, isLoading, addItem, removeItem } = useInbox(date);
  const { createTask } = useTasks(date);
  const { mutate: mutateDaily } = useDaily(date);
  const [input, setInput] = useState('');
  const [promotingText, setPromotingText] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addItem(input.trim());
    setInput('');
  };

  const handlePromote = (id: string, text: string) => {
    setPromotingId(id);
    setPromotingText(text);
  };

  const handlePromoteSubmit = async (data: Partial<Task>) => {
    await createTask(data);
    if (promotingId) await removeItem(promotingId);
    setPromotingText(null);
    setPromotingId(null);
    mutateDaily();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-text-primary mb-5">Inbox</h1>

      <form onSubmit={handleAdd} className="mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Quick capture — type and press Enter (e.g., Call Ravi, Send proposal...)"
          autoFocus
          className="w-full px-4 py-3 text-[14px] bg-surface border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </form>

      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover group transition-colors"
            >
              <div className="flex-1 min-w-0">
                <span className="text-[13px] text-text-primary">{item.text}</span>
                <span className="text-[11px] text-text-secondary ml-2">
                  {format(new Date(item.capturedAt), 'h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handlePromote(item.id, item.text)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-accent hover:bg-accent-light rounded transition-colors"
                >
                  <ArrowRight size={12} />
                  Promote
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Inbox is empty"
          description="Type above to quickly capture tasks, ideas, and reminders."
        />
      )}

      <Dialog
        open={!!promotingText}
        onClose={() => { setPromotingText(null); setPromotingId(null); }}
        title="Create Task from Inbox"
      >
        {promotingText && (
          <TaskForm
            task={{ title: promotingText } as Task}
            onSubmit={handlePromoteSubmit}
            onCancel={() => { setPromotingText(null); setPromotingId(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}
