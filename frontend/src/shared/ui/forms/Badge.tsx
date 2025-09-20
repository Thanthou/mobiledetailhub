/* eslint-disable react/prop-types */
import React from 'react';

import { cn } from '@/shared/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground border border-input',
      success: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <div className="w-2 h-2 rounded-full bg-current mr-1.5" />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
