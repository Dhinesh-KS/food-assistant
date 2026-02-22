import { Food, FoodWithEmbedding, SortOption } from '@/types/food';
import foodsData from '@/resources/Foods.json';

let foodsWithEmbeddings: FoodWithEmbedding[] | null = null;

// ============================================================================
// Core Food Functions (Client-Safe)
// ============================================================================

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

// ============================================================================
// Sorting Functions
// ============================================================================

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

// ============================================================================
// Popular & Recommended Functions
// ============================================================================

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

export function getFoodsByCategory(category: string, limit: number = 20): Food[] {
  const foods = getFoodsWithEmbeddings();
  return foods
    .filter(food => food.category.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      name: f.name,
      image: f.image,
      description: f.description,
      category: f.category,
      type: f.type,
      spiceLevel: f.spiceLevel,
      ingredients: f.ingredients,
      nutrition: f.nutrition,
      price: f.price,
      serves: f.serves,
    }));
}

export function getFoodsByType(type: string, limit: number = 20): Food[] {
  const foods = getFoodsWithEmbeddings();
  return foods
    .filter(food => food.type.toLowerCase() === type.toLowerCase())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      name: f.name,
      image: f.image,
      description: f.description,
      category: f.category,
      type: f.type,
      spiceLevel: f.spiceLevel,
      ingredients: f.ingredients,
      nutrition: f.nutrition,
      price: f.price,
      serves: f.serves,
    }));
}
