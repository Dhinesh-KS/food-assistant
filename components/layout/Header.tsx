"use client";

import { ShoppingCart, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';
import { CartDrawer } from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, user } = useUser();

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

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {mounted && (
              <>
                {!isSignedIn ? (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="font-semibold">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-semibold">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      Hi, {user?.firstName || 'there'}!
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9"
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
            
            {isSignedIn ? (
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
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
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="default"
                  className="relative hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Cart</span>
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
