"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ColumnProps } from '@/types/component';

interface ColumnComponentProps extends ColumnProps {
  children?: ReactNode;
}

export function Column({ 
  justify = 'start',
  align = 'start',
  gap,
  padding,
  className,
  children 
}: ColumnComponentProps) {
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
        'flex flex-col',
        justifyStyles[justify],
        alignStyles[align],
        className
      )}
      style={{ gap, padding }}
    >
      {children}
    </div>
  );
}
