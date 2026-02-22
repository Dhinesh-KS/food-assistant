"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export function FoodCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
        <Skeleton className="h-48 w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            <Skeleton className="h-5 w-20 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
          <Skeleton className="h-16 w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            <Skeleton className="h-10 flex-1 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <FoodCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}
