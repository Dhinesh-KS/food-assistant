"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SortOption } from '@/types/food';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
  onToggleFilters: () => void;
  showMobileFilterButton?: boolean;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultsCount,
  onToggleFilters,
  showMobileFilterButton = true,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex gap-2 w-full sm:w-auto flex-1">
        {showMobileFilterButton && (
          <Button
            variant="outline"
            size="default"
            onClick={onToggleFilters}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        )}
        
        <div className="relative flex-1 sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {resultsCount} {resultsCount === 1 ? 'item' : 'items'}
        </span>
        
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="calories-low">Calories (Low to High)</option>
          <option value="protein-high">Protein (High to Low)</option>
        </select>
      </div>
    </div>
  );
}
