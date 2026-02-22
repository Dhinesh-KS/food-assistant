"use client";

import { cn } from '@/lib/utils';
import { TitleProps } from '@/types/component';

export function Title({ 
  text,
  size = 'md',
  weight = 'semibold',
  className 
}: TitleProps) {
  const sizeStyles = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <h3 
      className={cn(
        sizeStyles[size],
        weightStyles[weight],
        'text-foreground',
        className
      )}
    >
      {text}
    </h3>
  );
}
