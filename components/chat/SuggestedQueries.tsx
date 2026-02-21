"use client";

import { Sparkles } from 'lucide-react';

interface SuggestedQueriesProps {
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  const suggestions = [
    { icon: "🥗", text: "Vegetarian options", query: "Show me vegetarian options" },
    { icon: "💪", text: "High protein meals", query: "I need high protein meals" },
    { icon: "🌶️", text: "Spicy food", query: "I want something spicy" },
    { icon: "🍚", text: "North Indian", query: "What North Indian dishes do you have?" },
    { icon: "🥤", text: "Beverages", query: "Show me drinks and beverages" },
    { icon: "🍰", text: "Desserts", query: "What desserts do you have?" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>Try asking:</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.query)}
            className="p-3 border rounded-lg hover:bg-accent hover:border-primary transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{suggestion.icon}</span>
              <span className="text-sm font-medium group-hover:text-primary">
                {suggestion.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
