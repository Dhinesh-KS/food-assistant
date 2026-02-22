"use client";

import { cn } from '@/lib/utils';
import { CaptionProps } from '@/types/component';

export function Caption({ 
  text,
  weight = 'normal',
  color = 'secondary',
  className 
}: CaptionProps) {
  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorStyles = {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    muted: 'text-muted-foreground',
  };

  return (
    <span 
      className={cn(
        'text-xs',
        weightStyles[weight],
        colorStyles[color],
        className
      )}
    >
      {text}
    </span>
  );
}
