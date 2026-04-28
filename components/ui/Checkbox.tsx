'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function Checkbox({ checked, onChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
        checked
          ? 'bg-accent border-accent'
          : 'border-border-subtle hover:border-accent/50',
        className
      )}
    >
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
    </button>
  );
}
