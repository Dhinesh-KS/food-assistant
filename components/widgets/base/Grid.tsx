"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GridProps } from '@/types/component';

interface GridComponentProps extends GridProps {
  children?: ReactNode;
}

export function Grid({ 
  columns = 2,
  gap = '16px',
  className,
  children 
}: GridComponentProps) {
  return (
    <div 
      className={cn('grid', className)}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap 
      }}
    >
      {children}
    </div>
  );
}
