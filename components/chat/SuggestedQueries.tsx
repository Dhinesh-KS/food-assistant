"use client";

import { Sparkles, Leaf, Flame, Drumstick, Coffee, Cake, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuggestedQueriesProps {
  onSelect: (query: string) => void;
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  const suggestions = [
    { icon: "🥗", text: "Vegetarian options", query: "Show me vegetarian options", color: "from-green-500 to-emerald-500" },
    { icon: "💪", text: "High protein meals", query: "I need high protein meals", color: "from-blue-500 to-cyan-500" },
    { icon: "🌶️", text: "Spicy food", query: "I want something spicy", color: "from-red-500 to-orange-500" },
    { icon: "🍚", text: "North Indian", query: "What North Indian dishes do you have?", color: "from-amber-500 to-yellow-500" },
    { icon: "🥤", text: "Beverages", query: "Show me drinks and beverages", color: "from-purple-500 to-pink-500" },
    { icon: "🍰", text: "Desserts", query: "What desserts do you have?", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <span>Popular searches to get you started</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            onClick={() => onSelect(suggestion.query)}
            className="relative p-4 border-2 rounded-xl hover:shadow-lg transition-all text-left group overflow-hidden bg-card hover:border-orange-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative flex flex-col gap-2">
              <span className="text-3xl">{suggestion.icon}</span>
              <span className="text-sm font-semibold group-hover:text-orange-600 transition-colors">
                {suggestion.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="text-center text-xs text-muted-foreground mt-6"
      >
        <p>Or simply type what you're craving below ⬇️</p>
      </motion.div>
    </div>
  );
}
