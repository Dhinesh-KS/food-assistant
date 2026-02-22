"use client";

import { cn } from '@/lib/utils';
import { ButtonProps, ActionSchema } from '@/types/component';

interface ButtonComponentProps extends ButtonProps {
  onAction?: (action: ActionSchema) => void;
}

export function Button({ 
  text,
  variant = 'primary',
  size = 'md',
  disabled = false,
  action,
  onAction,
  className 
}: ButtonComponentProps) {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm font-semibold',
    lg: 'h-11 px-8 text-base',
  };

  const handleClick = () => {
    if (action && onAction) {
      onAction(action);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-95',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {text}
    </button>
  );
}
