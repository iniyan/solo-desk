'use client';

import { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';

interface Focus3WidgetProps {
  items: string[];
  onUpdate: (items: string[]) => void;
}

export default function Focus3Widget({ items, onUpdate }: Focus3WidgetProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    if (items.length >= 3) return;
    setEditing(items.length);
    setDraft('');
  };

  const handleSave = () => {
    if (draft.trim() && editing !== null) {
      const updated = [...items];
      updated[editing] = draft.trim();
      onUpdate(updated);
    }
    setEditing(null);
    setDraft('');
  };

  const handleRemove = (idx: number) => {
    onUpdate(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-accent" />
        <h3 className="text-[14px] font-semibold text-text-primary">Today&apos;s Focus 3</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 group">
            <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[12px] font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </span>
            {editing === idx ? (
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={handleSave}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="flex-1 px-2 py-1 text-[13px] bg-surface border border-border-subtle rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            ) : (
              <>
                <span
                  className="flex-1 text-[13px] text-text-primary cursor-pointer hover:text-accent transition-colors"
                  onClick={() => { setEditing(idx); setDraft(item); }}
                >
                  {item}
                </span>
                <button
                  onClick={() => handleRemove(idx)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-text-secondary hover:text-red-500 transition-all"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        ))}

        {editing === items.length && (
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-[12px] font-bold flex items-center justify-center flex-shrink-0">
              {items.length + 1}
            </span>
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={handleSave}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="What's most important today?"
              className="flex-1 px-2 py-1 text-[13px] bg-surface border border-border-subtle rounded text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        )}

        {items.length < 3 && editing === null && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-[12px] text-text-secondary hover:text-accent transition-colors mt-1"
          >
            <Plus size={14} />
            Add focus item
          </button>
        )}
      </div>
    </div>
  );
}
