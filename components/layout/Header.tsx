"use client";

import { ShoppingCart, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';
import { CartDrawer } from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Spice & Delight
                </h1>
                <Sparkles className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">AI-Powered Ordering Assistant</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => setIsCartOpen(true)}
            className="relative hover:bg-orange-50 hover:border-orange-300 transition-all"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-semibold">Cart</span>
            <AnimatePresence>
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
