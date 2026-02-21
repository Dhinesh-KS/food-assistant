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
