"use client";

import { Food } from '@/lib/food/types';
import { FoodCard } from './FoodCard';

interface FoodGridProps {
  foods: Food[];
  message?: string;
}

export function FoodGrid({ foods, message }: FoodGridProps) {
  if (foods.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No items found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <p className="text-sm text-foreground">{message}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
}
