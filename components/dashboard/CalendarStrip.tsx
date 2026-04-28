'use client';

import { clsx } from 'clsx';
import { getWeekDays, formatDayName, isDayToday } from '@/lib/dates';
import { useDate } from '@/hooks/useDate';

interface CalendarStripProps {
  taskCounts?: Record<string, number>;
}

export default function CalendarStrip({ taskCounts = {} }: CalendarStripProps) {
  const { date, setDate } = useDate();
  const weekDays = getWeekDays(date);

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">This Week</h3>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => {
          const isSelected = day === date;
          const isToday = isDayToday(day);
          const count = taskCounts[day] || 0;
          const dayNum = day.split('-')[2];

          return (
            <button
              key={day}
              onClick={() => setDate(day)}
              className={clsx(
                'flex flex-col items-center py-2 rounded-lg transition-colors',
                isSelected
                  ? 'bg-accent text-white'
                  : isToday
                  ? 'bg-accent-light text-accent'
                  : 'hover:bg-surface-hover text-text-secondary'
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {formatDayName(day)}
              </span>
              <span className={clsx('text-[15px] font-semibold mt-0.5', !isSelected && 'text-text-primary')}>
                {dayNum}
              </span>
              {count > 0 && (
                <div className={clsx(
                  'w-1.5 h-1.5 rounded-full mt-1',
                  isSelected ? 'bg-white/70' : 'bg-accent'
                )} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
