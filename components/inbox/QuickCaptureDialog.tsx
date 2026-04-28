'use client';

import { useState, useRef, useEffect } from 'react';
import Dialog from '../ui/Dialog';
import { useInbox } from '@/hooks/useInbox';
import { useDate } from '@/hooks/useDate';

interface QuickCaptureDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function QuickCaptureDialog({ open, onClose }: QuickCaptureDialogProps) {
  const { date } = useDate();
  const { addItem } = useInbox(date);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addItem(text.trim());
    setText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Quick Capture">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What's on your mind? (e.g., Call Ravi, Send proposal...)"
          className="w-full px-3 py-2.5 text-[14px] bg-surface border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-[13px] font-medium text-white bg-accent rounded-lg hover:opacity-90 transition-opacity"
          >
            Capture
          </button>
        </div>
      </form>
    </Dialog>
  );
}
