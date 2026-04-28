'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-accent text-white hover:opacity-90': variant === 'primary',
            'bg-surface border border-border-subtle text-text-primary hover:bg-surface-hover': variant === 'secondary',
            'text-text-secondary hover:text-text-primary hover:bg-surface-hover': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'px-2.5 py-1 text-xs gap-1.5': size === 'sm',
            'px-3.5 py-2 text-[13px] gap-2': size === 'md',
            'px-5 py-2.5 text-sm gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
