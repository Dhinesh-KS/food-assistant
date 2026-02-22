import { SearchFilters, SearchResult } from '@/types/food';
import { getFoodsWithEmbeddings } from './food-client';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Re-export client-safe functions
export * from './food-client';

// ============================================================================
// Server-Only Search Functions
// ============================================================================

// Semantic query expansion using LLM
export async function expandQuery(query: string): Promise<string> {
  try {
    const expansion = await openai.chat.completions.create({
      messages: [{
        role: 'system',
        content: `You are a food search query expander. Given a user's food query, expand it with RELEVANT keywords only:
- Direct synonyms of the food/dish
- Related ingredients (only if specific food mentioned)
- Flavor profiles (only if mentioned)
- Common preparations (only if specific food mentioned)

IMPORTANT: 
- Keep expansions FOCUSED and SPECIFIC to the query
- For specific items (coffee, pizza, biryani), expand with variations of THAT item only
- For vague queries (healthy, spicy), expand with descriptive terms
- Return ONLY comma-separated keywords, nothing else

Examples:
"coffee" → "coffee,filter coffee,cappuccino,espresso,latte,caffeine,beverage"
"creamy" → "creamy,cream,butter,rich,velvety,smooth,luxurious,indulgent"
"spicy" → "spicy,hot,chili,pepper,heat,fiery,bold,tangy"
"healthy" → "healthy,protein,lean,nutritious,light,low-calorie,wholesome"
"pizza" → "pizza,margherita,pepperoni,cheese,italian,flatbread"
"breakfast" → "breakfast,morning,light,fresh,energizing,dosa,idli,paratha,upma"`
      }, {
        role: 'user',
        content: query
      }],
      model: 'gpt-4o-mini',
      temperature: 0.5,
      max_tokens: 100,
    });

    const expanded = expansion.choices[0]?.message?.content || query;
    return expanded.toLowerCase();
  } catch (error) {
    console.error('Query expansion error:', error);
    return query;
  }
}

export async function searchFoods(
  query: string,
  filters?: SearchFilters,
  limit: number = 10,
  context?: string[]
): Promise<SearchResult[]> {
  const foods = getFoodsWithEmbeddings();
  
  // Expand query semantically using LLM
  const expandedQuery = await expandQuery(query);
  
  // Combine with context from conversation
  const contextQuery = context?.join(' ') || '';
  const fullQuery = `${expandedQuery} ${contextQuery}`.toLowerCase();
  
  const queryWords = fullQuery.split(/[,\s]+/).filter(w => w.length > 2);
  const queryLower = query.toLowerCase();
  
  let results = foods.map(food => {
    let score = 0;
    
    // Exact name match (highest priority)
    if (food.name.toLowerCase().includes(queryLower)) {
      score += 15;
    }
    
    // Expanded query matching
    queryWords.forEach(word => {
      // Name matching
      if (food.name.toLowerCase().includes(word)) {
        score += 8;
      }
      
      // Description matching
      if (food.description.toLowerCase().includes(word)) {
        score += 5;
      }
      
      // Category matching
      if (food.category.toLowerCase().includes(word)) {
        score += 4;
      }
      
      // Ingredients matching
      if (food.ingredients.some(ing => ing.toLowerCase().includes(word))) {
        score += 3;
      }
      
      // Search text matching
      if (food.searchText.includes(word)) {
        score += 2;
      }
    });
    
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
  
  // Filter out low-score results (noise)
  results = results.filter(({ score }) => score >= 5);
  
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}
