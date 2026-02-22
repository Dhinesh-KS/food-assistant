"use client";

import { cn } from '@/lib/utils';
import { TextProps } from '@/types/component';

export function Text({ 
  text,
  size = 'base',
  weight = 'normal',
  color = 'primary',
  className 
}: TextProps) {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorStyles = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
  };

  return (
    <p 
      className={cn(
        sizeStyles[size],
        weightStyles[weight],
        colorStyles[color],
        className
      )}
    >
      {text}
    </p>
  );
}
