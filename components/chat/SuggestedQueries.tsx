"use client";

import { Sparkles, Leaf, Flame, Drumstick, Coffee, Cake, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
        <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
        <span>Popular searches to get you started</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.7 + index * 0.08,
              duration: 0.4
            }}
            onClick={() => onSelect(suggestion.query)}
            className="
              relative p-5 rounded-2xl transition-all duration-200 text-left group overflow-hidden
              bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40
              border-2 border-orange-200 dark:border-orange-800
              hover:border-orange-500 dark:hover:border-orange-500
              shadow-sm hover:shadow-lg hover:shadow-orange-300/50 dark:hover:shadow-orange-900/50
              cursor-pointer
            "
            aria-label={`Search for ${suggestion.text}`}
          >
            <div className="relative flex flex-col gap-3 items-start">
              <div className="text-4xl">
                {suggestion.icon}
              </div>
              <span className="text-sm font-bold text-foreground transition-colors">
                {suggestion.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center text-sm text-muted-foreground mt-8"
      >
        <p className="font-medium">Or simply type what you're craving below ⬇️</p>
      </motion.div>
    </div>
  );
}
