import React from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ 
    className, 
    isSelected = false, 
    icon: Icon, 
    children, 
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: isSelected 
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600' 
        : 'bg-stone-800/70 text-stone-200 hover:bg-stone-700/70 hover:text-white border border-stone-600/50',
      outline: isSelected
        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
        : 'text-stone-200 border border-stone-600/50 hover:bg-stone-800/50 hover:border-stone-500',
      ghost: isSelected
        ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
        : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';

export { FilterChip };
