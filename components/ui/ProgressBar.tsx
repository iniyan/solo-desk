import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max = 100, color = 'bg-accent', className, showLabel = false }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium text-text-secondary w-8 text-right">
          {percent}%
        </span>
      )}
    </div>
  );
}
