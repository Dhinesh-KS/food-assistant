import { Food } from './types';
import { getAllFoods } from './index';

export function getPopularItems(limit: number = 8): Food[] {
  const foods = getAllFoods();
  
  const popularIds = [1, 3, 5, 8, 12, 15, 20, 25];
  
  const popularFoods = popularIds
    .map(id => foods.find(f => f.id === id))
    .filter((f): f is Food => f !== undefined)
    .slice(0, limit);
  
  if (popularFoods.length < limit) {
    const remaining = foods
      .filter(f => !popularIds.includes(f.id))
      .slice(0, limit - popularFoods.length);
    popularFoods.push(...remaining);
  }
  
  return popularFoods;
}

export function getTrendingItems(limit: number = 6): Food[] {
  return getPopularItems(limit);
}

export function getRecommendedForYou(limit: number = 6): Food[] {
  const foods = getAllFoods();
  
  const recommendedCategories = ['North Indian', 'Street Food', 'Desserts'];
  
  return foods
    .filter(f => recommendedCategories.includes(f.category))
    .slice(0, limit);
}
