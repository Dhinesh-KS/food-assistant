"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuantitySelectorProps } from '../schema';

interface QuantitySelectorComponentProps extends QuantitySelectorProps {
  onChange?: (id: string, quantity: number) => void;
}

export function QuantitySelector({ 
  id,
  min = 1,
  max = 10,
  default: defaultValue = 1,
  onChange,
  className 
}: QuantitySelectorComponentProps) {
  const [quantity, setQuantity] = useState(defaultValue);

  const handleIncrement = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onChange?.(id, newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onChange?.(id, newQuantity);
  };

  return (
    <div className={cn('inline-flex items-center border rounded-lg h-10', className)}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="h-full w-10 flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="h-full w-10 flex items-center justify-center hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
