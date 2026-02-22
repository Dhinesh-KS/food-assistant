"use client";

import { Food } from '@/lib/food/types';
import { FoodCard } from '@/components/chat/dynamic/FoodCard';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

interface FoodGridProps {
  foods: Food[];
  isLoading?: boolean;
}

export function FoodGrid({ foods, isLoading }: FoodGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[500px] bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No items found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map((food, index) => (
        <motion.div
          key={food.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <FoodCard food={food} />
        </motion.div>
      ))}
    </div>
  );
}
