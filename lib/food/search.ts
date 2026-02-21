import { Food, SearchFilters, SearchResult } from './types';
import { getFoodsWithEmbeddings } from './index';

export function searchFoods(
  query: string,
  filters?: SearchFilters,
  limit: number = 10
): SearchResult[] {
  const foods = getFoodsWithEmbeddings();
  const queryLower = query.toLowerCase();
  
  const synonyms: Record<string, string[]> = {
    'chicken': ['chicken', 'murgh'],
    'vegetarian': ['vegetarian', 'veg', 'veggie', 'plant-based'],
    'spicy': ['spicy', 'hot', 'chili', 'pepper'],
    'mild': ['mild', 'light', 'subtle'],
    'dessert': ['dessert', 'sweet', 'mithai'],
    'drink': ['drink', 'beverage', 'juice', 'lassi'],
    'bread': ['bread', 'naan', 'roti', 'paratha'],
    'rice': ['rice', 'biryani', 'pulao'],
  };
  
  let expandedQuery = queryLower;
  Object.entries(synonyms).forEach(([key, values]) => {
    if (values.some(v => queryLower.includes(v))) {
      expandedQuery += ' ' + values.join(' ');
    }
  });
  
  let results = foods.map(food => {
    let score = 0;
    
    if (food.name.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    if (food.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }
    
    if (food.category.toLowerCase().includes(queryLower)) {
      score += 3;
    }
    
    if (food.ingredients.some(ing => ing.toLowerCase().includes(queryLower))) {
      score += 4;
    }
    
    const queryWords = expandedQuery.split(' ').filter(w => w.length > 2);
    queryWords.forEach(word => {
      if (food.searchText.includes(word)) {
        score += 1;
      }
    });
    
    if (score === 0 && queryWords.length > 0) {
      queryWords.forEach(word => {
        if (food.searchText.includes(word.substring(0, 4))) {
          score += 0.5;
        }
      });
    }
    
    return {
      food: {
        id: food.id,
        name: food.name,
        image: food.image,
        description: food.description,
        category: food.category,
        type: food.type,
        spiceLevel: food.spiceLevel,
        ingredients: food.ingredients,
        nutrition: food.nutrition,
        price: food.price,
        serves: food.serves,
      },
      score,
    };
  });
  
  if (filters) {
    results = results.filter(({ food }) => {
      if (filters.category && !food.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }
      
      if (filters.type && food.type.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }
      
      if (filters.spiceLevel && food.spiceLevel.toLowerCase() !== filters.spiceLevel.toLowerCase()) {
        return false;
      }
      
      if (filters.maxCalories && food.nutrition.calories > filters.maxCalories) {
        return false;
      }
      
      if (filters.minProtein) {
        const protein = parseInt(food.nutrition.protein);
        if (protein < filters.minProtein) {
          return false;
        }
      }
      
      if (filters.maxCarbs) {
        const carbs = parseInt(food.nutrition.carbs);
        if (carbs > filters.maxCarbs) {
          return false;
        }
      }
      
      if (filters.maxPrice && food.price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  }
  
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
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
