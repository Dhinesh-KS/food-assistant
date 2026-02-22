import { Food, FoodWithEmbedding } from './types';
import foodsData from '@/resources/Foods.json';

let foodsWithEmbeddings: FoodWithEmbedding[] | null = null;

export function getAllFoods(): Food[] {
  return foodsData.foods as Food[];
}

export function getFoodById(id: number): Food | undefined {
  return getAllFoods().find(food => food.id === id);
}

export function createSearchText(food: Food): string {
  return `${food.name} ${food.description} ${food.category} ${food.type} ${food.ingredients.join(' ')} ${food.spiceLevel}`.toLowerCase();
}

export async function initializeFoodEmbeddings(): Promise<void> {
  if (foodsWithEmbeddings) return;
  
  const foods = getAllFoods();
  
  foodsWithEmbeddings = foods.map(food => ({
    ...food,
    embedding: [],
    searchText: createSearchText(food),
  }));
}

export function getFoodsWithEmbeddings(): FoodWithEmbedding[] {
  if (!foodsWithEmbeddings) {
    const foods = getAllFoods();
    foodsWithEmbeddings = foods.map(food => ({
      ...food,
      embedding: [],
      searchText: createSearchText(food),
    }));
  }
  return foodsWithEmbeddings;
}

export function getUniqueCategories(): string[] {
  const foods = getAllFoods();
  const categories = new Set(foods.map(food => food.category));
  return Array.from(categories).sort();
}

export function getUniqueSpiceLevels(): string[] {
  const foods = getAllFoods();
  const spiceLevels = new Set(foods.map(food => food.spiceLevel).filter(Boolean));
  return Array.from(spiceLevels).sort();
}

export type SortOption = 'name-asc' | 'price-low' | 'price-high' | 'calories-low' | 'protein-high';

export function sortFoods(foods: Food[], sortBy: SortOption): Food[] {
  const sorted = [...foods];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'calories-low':
      return sorted.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
    case 'protein-high':
      return sorted.sort((a, b) => {
        const proteinA = parseInt(a.nutrition.protein) || 0;
        const proteinB = parseInt(b.nutrition.protein) || 0;
        return proteinB - proteinA;
      });
    default:
      return sorted;
  }
}
