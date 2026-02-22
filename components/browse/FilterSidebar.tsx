"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Leaf, Drumstick } from 'lucide-react';
import { SearchFilters } from '@/lib/food/types';

interface FilterSidebarProps {
  categories: string[];
  spiceLevels: string[];
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export function FilterSidebar({
  categories,
  spiceLevels,
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: FilterSidebarProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    updateFilter('category', filters.category === category ? undefined : category);
  };

  const toggleType = (type: string) => {
    updateFilter('type', filters.type === type ? undefined : type);
  };

  const toggleSpiceLevel = (level: string) => {
    updateFilter('spiceLevel', filters.spiceLevel === level ? undefined : level);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-orange-600 hover:text-orange-700"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Dietary Type */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Dietary Type</h3>
        <div className="space-y-2">
          <Button
            variant={filters.type === 'Vegetarian' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('Vegetarian')}
            className={`w-full justify-start ${
              filters.type === 'Vegetarian'
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : ''
            }`}
          >
            <Leaf className="w-4 h-4 mr-2" />
            Vegetarian
          </Button>
          <Button
            variant={filters.type === 'Non-Vegetarian' ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleType('Non-Vegetarian')}
            className={`w-full justify-start ${
              filters.type === 'Non-Vegetarian'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                : ''
            }`}
          >
            <Drumstick className="w-4 h-4 mr-2" />
            Non-Vegetarian
          </Button>
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filters.category === category ? 'default' : 'outline'}
              className={`cursor-pointer ${
                filters.category === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                  : 'hover:bg-muted'
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Spice Level */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Spice Level</h3>
        <div className="flex flex-wrap gap-2">
          {spiceLevels.map((level) => (
            <Badge
              key={level}
              variant={filters.spiceLevel === level ? 'default' : 'outline'}
              className={`cursor-pointer ${
                filters.spiceLevel === level
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                  : 'hover:bg-muted'
              }`}
              onClick={() => toggleSpiceLevel(level)}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Max Price</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.maxPrice || 1000}
            onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span className="font-semibold text-foreground">
              {filters.maxPrice ? `₹${filters.maxPrice}` : 'Any'}
            </span>
            <span>₹1000</span>
          </div>
        </div>
      </div>

      {/* Nutrition Filters */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Nutrition</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Max Calories
            </label>
            <input
              type="number"
              placeholder="e.g., 500"
              value={filters.maxCalories || ''}
              onChange={(e) =>
                updateFilter('maxCalories', e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Min Protein (g)
            </label>
            <input
              type="number"
              placeholder="e.g., 20"
              value={filters.minProtein || ''}
              onChange={(e) =>
                updateFilter('minProtein', e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Max Carbs (g)
            </label>
            <input
              type="number"
              placeholder="e.g., 50"
              value={filters.maxCarbs || ''}
              onChange={(e) =>
                updateFilter('maxCarbs', e.target.value ? parseInt(e.target.value) : undefined)
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
