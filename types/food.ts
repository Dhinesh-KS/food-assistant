export interface Food {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  type: string;
  spiceLevel: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  price: number;
  serves: number;
  preparationTime?: string;
}

export interface FoodWithEmbedding extends Food {
  embedding: number[];
  searchText: string;
}

export interface SearchFilters {
  category?: string;
  type?: string;
  spiceLevel?: string;
  maxCalories?: number;
  minProtein?: number;
  maxCarbs?: number;
  maxPrice?: number;
}

export interface SearchResult {
  food: Food;
  score: number;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export type SortOption = 'name-asc' | 'price-low' | 'price-high' | 'calories-low' | 'protein-high';
