"use client";

import { useState, useMemo, useEffect } from 'react';
import { Food, SearchFilters } from '@/lib/food/types';
import { getAllFoods, getUniqueCategories, getUniqueSpiceLevels, sortFoods, SortOption } from '@/lib/food/index';
import { FilterSidebar } from './FilterSidebar';
import { SearchBar } from './SearchBar';
import { FoodGrid } from './FoodGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function BrowseView() {
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [spiceLevels, setSpiceLevels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foods = getAllFoods();
    setAllFoods(foods);
    setCategories(getUniqueCategories());
    setSpiceLevels(getUniqueSpiceLevels());
    setIsLoading(false);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredAndSortedFoods = useMemo(() => {
    let results = allFoods;

    // Apply debounced search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      results = results.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query) ||
          food.category.toLowerCase().includes(query) ||
          food.ingredients.some((ing) => ing.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter((food) => food.category === filters.category);
    }

    if (filters.type) {
      results = results.filter((food) => food.type === filters.type);
    }

    if (filters.spiceLevel) {
      results = results.filter((food) => food.spiceLevel === filters.spiceLevel);
    }

    if (filters.maxPrice) {
      results = results.filter((food) => food.price <= filters.maxPrice!);
    }

    if (filters.maxCalories) {
      results = results.filter((food) => food.nutrition.calories <= filters.maxCalories!);
    }

    if (filters.minProtein) {
      results = results.filter((food) => {
        const protein = parseInt(food.nutrition.protein) || 0;
        return protein >= filters.minProtein!;
      });
    }

    if (filters.maxCarbs) {
      results = results.filter((food) => {
        const carbs = parseInt(food.nutrition.carbs) || 0;
        return carbs <= filters.maxCarbs!;
      });
    }

    // Apply sorting
    return sortFoods(results, sortBy);
  }, [allFoods, debouncedSearchQuery, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.type) count++;
    if (filters.spiceLevel) count++;
    if (filters.maxPrice && filters.maxPrice < 1000) count++;
    if (filters.maxCalories) count++;
    if (filters.minProtein) count++;
    if (filters.maxCarbs) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-background overflow-y-auto p-6">
        <FilterSidebar
          categories={categories}
          spiceLevels={spiceLevels}
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
        />
      </aside>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background z-50 overflow-y-auto p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <FilterSidebar
                categories={categories}
                spiceLevels={spiceLevels}
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Browse Menu
                </h1>
                <p className="text-muted-foreground mt-1">
                  Explore our full collection of delicious dishes
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" size="default">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </Link>
            </div>

            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultsCount={filteredAndSortedFoods.length}
              onToggleFilters={() => setIsMobileFilterOpen(true)}
            />
          </div>

          {/* Active Filters */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  {filters.category}
                  <button onClick={() => removeFilter('category')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1">
                  {filters.type}
                  <button onClick={() => removeFilter('type')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.spiceLevel && (
                <Badge variant="secondary" className="gap-1">
                  {filters.spiceLevel}
                  <button onClick={() => removeFilter('spiceLevel')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxPrice && filters.maxPrice < 1000 && (
                <Badge variant="secondary" className="gap-1">
                  Max ₹{filters.maxPrice}
                  <button onClick={() => removeFilter('maxPrice')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxCalories && (
                <Badge variant="secondary" className="gap-1">
                  Max {filters.maxCalories} cal
                  <button onClick={() => removeFilter('maxCalories')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.minProtein && (
                <Badge variant="secondary" className="gap-1">
                  Min {filters.minProtein}g protein
                  <button onClick={() => removeFilter('minProtein')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxCarbs && (
                <Badge variant="secondary" className="gap-1">
                  Max {filters.maxCarbs}g carbs
                  <button onClick={() => removeFilter('maxCarbs')} className="ml-1 hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(activeFilterCount > 0 || searchQuery) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-orange-600">
                  Clear all
                </Button>
              )}
            </div>
          )}

          {/* Food Grid */}
          <FoodGrid foods={filteredAndSortedFoods} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
