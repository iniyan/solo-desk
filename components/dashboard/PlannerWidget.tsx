'use client';

import { TimeBlock } from '@/lib/types';
import { Clock } from 'lucide-react';
import Link from 'next/link';

interface PlannerWidgetProps {
  blocks: TimeBlock[];
}

export default function PlannerWidget({ blocks }: PlannerWidgetProps) {
  const display = blocks.slice(0, 5);

  return (
    <div className="bg-background border border-border-subtle rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-text-primary">Today&apos;s Schedule</h3>
        <Link href="/planner" className="text-[11px] text-accent hover:underline">
          View all
        </Link>
      </div>

      {display.length === 0 ? (
        <p className="text-[13px] text-text-secondary">No time blocks scheduled.</p>
      ) : (
        <div className="space-y-2">
          {display.map(block => (
            <div key={block.id} className="flex items-center gap-3">
              <span className="text-[12px] font-mono text-text-secondary w-12 flex-shrink-0">
                {block.time}
              </span>
              <div className="w-0.5 h-4 bg-accent rounded-full flex-shrink-0" />
              <span className="text-[13px] text-text-primary truncate">{block.label}</span>
              {block.org && (
                <span className="text-[11px] text-text-secondary ml-auto flex-shrink-0">
                  {block.org}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
