"use client";

import { cn } from '@/lib/utils';
import { DividerProps } from '../schema';

export function Divider({ className }: DividerProps) {
  return (
    <hr className={cn('border-t border-border', className)} />
  );
}
