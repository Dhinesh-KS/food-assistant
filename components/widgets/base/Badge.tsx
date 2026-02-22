"use client";

import { cn } from '@/lib/utils';
import { Leaf, Flame, Star, Check, Clock } from 'lucide-react';
import { BadgeProps } from '@/types/component';

export function Badge({ 
  text,
  variant = 'default',
  icon,
  className 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    outline: 'bg-transparent border-border text-foreground',
    secondary: 'bg-secondary text-secondary-foreground border-secondary',
  };

  const iconMap = {
    leaf: Leaf,
    flame: Flame,
    star: Star,
    check: Check,
    clock: Clock,
  };

  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border',
        variantStyles[variant],
        className
      )}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      {text}
    </span>
  );
}
