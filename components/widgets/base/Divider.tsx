"use client";

import { cn } from '@/lib/utils';
import { DividerProps } from '@/types/component';

export function Divider({ className }: DividerProps) {
  return (
    <hr className={cn('border-t border-border', className)} />
  );
}
