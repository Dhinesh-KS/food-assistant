"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '../schema';

interface CardComponentProps extends CardProps {
  children?: ReactNode;
}

export function Card({ 
  variant = 'default', 
  padding, 
  className,
  children 
}: CardComponentProps) {
  const variantStyles = {
    default: 'bg-card border border-border',
    subtle: 'bg-muted/50 border-0',
    outline: 'bg-transparent border border-border',
  };

  return (
    <div 
      className={cn(
        'rounded-lg',
        variantStyles[variant],
        className
      )}
      style={{ padding }}
    >
      {children}
    </div>
  );
}
