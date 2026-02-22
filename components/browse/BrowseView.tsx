"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

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

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [debouncedSearchQuery, filters, sortBy]);

  // Load more callback
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || displayCount >= filteredAndSortedFoods.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, displayCount, filteredAndSortedFoods.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    const mainElement = mainRef.current;
    
    if (!loadMoreElement || !mainElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: mainElement,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore]);

  // Scroll position tracker for back to top button
  useEffect(() => {
    const handleScroll = () => {
      const mainElement = mainRef.current;
      if (mainElement) {
        setShowBackToTop(mainElement.scrollTop > 500);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
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
                <Button 
                  size="default"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                >
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
        </div>

        {/* Scrollable Content */}
        <div ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">

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
          <FoodGrid foods={filteredAndSortedFoods.slice(0, displayCount)} isLoading={isLoading} />

          {/* Intersection Observer Target */}
          {!isLoading && displayCount < filteredAndSortedFoods.length && (
            <div 
              ref={loadMoreRef} 
              className="h-32 flex items-center justify-center py-8"
              style={{ minHeight: '128px' }}
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-2 text-sm font-medium">Loading more delicious items...</span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground/50">
                  Scroll for more • {filteredAndSortedFoods.length - displayCount} items remaining
                </div>
              )}
            </div>
          )}

          {/* End of results message */}
          {!isLoading && displayCount >= filteredAndSortedFoods.length && filteredAndSortedFoods.length > 12 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm font-medium">You've reached the end! 🎉</p>
              <p className="text-xs mt-1">Showing all {filteredAndSortedFoods.length} items</p>
            </div>
          )}
          </div>
        </div>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-30 transition-all"
              aria-label="Scroll to top"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
