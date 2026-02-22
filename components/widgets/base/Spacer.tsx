"use client";

import { cn } from '@/lib/utils';
import { SpacerProps } from '@/types/component';

export function Spacer({ height = '16px', className }: SpacerProps) {
  return (
    <div className={cn(className)} style={{ height }} />
  );
}
