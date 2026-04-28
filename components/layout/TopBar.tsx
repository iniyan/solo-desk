'use client';

import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { formatDate, isDayToday } from '@/lib/dates';

interface TopBarProps {
  date: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onQuickCapture: () => void;
}

export default function TopBar({ date, onPrevDay, onNextDay, onToday, onQuickCapture }: TopBarProps) {
  const isToday = isDayToday(date);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-background sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevDay}
            className="p-1.5 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNextDay}
            className="p-1.5 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <h2 className="text-[15px] font-semibold text-text-primary">
          {formatDate(date)}
        </h2>

        {!isToday && (
          <button
            onClick={onToday}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-accent bg-accent-light rounded-md hover:opacity-90 transition-opacity"
          >
            <Calendar size={12} />
            Today
          </button>
        )}
      </div>

      <button
        onClick={onQuickCapture}
        className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-white bg-accent rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus size={14} />
        Quick Capture
      </button>
    </header>
  );
}
