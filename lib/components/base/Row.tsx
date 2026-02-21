"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RowProps } from '../schema';

interface RowComponentProps extends RowProps {
  children?: ReactNode;
}

export function Row({ 
  justify = 'start',
  align = 'start',
  gap,
  wrap = false,
  className,
  children 
}: RowComponentProps) {
  const justifyStyles = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
  };

  const alignStyles = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
  };

  return (
    <div 
      className={cn(
        'flex flex-row',
        justifyStyles[justify],
        alignStyles[align],
        wrap && 'flex-wrap',
        className
      )}
      style={{ gap }}
    >
      {children}
    </div>
  );
}
