"use client";

import { ShoppingCart, ChefHat, MessageSquare, Grid3x3, History, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useConversationStore } from '@/store/conversation';
import { useState, useEffect } from 'react';
import { CartDrawer } from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const setCurrentConversation = useConversationStore((state) => state.setCurrentConversation);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  
  const handleNewChat = () => {
    setCurrentConversation(null);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-orange-50 dark:hover:bg-orange-950 text-orange-600 dark:text-orange-400 h-10 w-10"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>

            <Link href="/" onClick={handleNewChat} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Spice & Delight
                </h1>
                <p className="text-xs text-muted-foreground font-medium">AI-Powered Ordering Assistant</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Cart Button - Before Profile */}
            {mounted && (
              <>
                {isSignedIn ? (
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      size="default"
                      className="relative hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      <span className="font-semibold hidden sm:inline">Cart</span>
                      <AnimatePresence>
                        {itemCount > 0 && (
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
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="default"
                      className="relative hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      <span className="font-semibold hidden sm:inline">Cart</span>
                    </Button>
                  </SignInButton>
                )}
              </>
            )}

            {/* Auth Buttons / User Profile */}
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
          </div>
        </div>

      </header>

      {/* Hamburger Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Menu
                      </h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Link href="/" onClick={handleNewChat}>
                    <Button
                      variant={pathname === '/' ? 'default' : 'ghost'}
                      className={`w-full justify-start text-base ${
                        pathname === '/'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                          : ''
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Chat with AI
                    </Button>
                  </Link>

                  <Link href="/browse" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={pathname === '/browse' ? 'default' : 'ghost'}
                      className={`w-full justify-start text-base ${
                        pathname === '/browse'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                          : ''
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5 mr-3" />
                      Browse Menu
                    </Button>
                  </Link>

                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={pathname === '/cart' ? 'default' : 'ghost'}
                      className={`w-full justify-start text-base relative ${
                        pathname === '/cart'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                          : ''
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      My Cart
                      {mounted && itemCount > 0 && (
                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href="/history" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={pathname === '/history' ? 'default' : 'ghost'}
                      className={`w-full justify-start text-base ${
                        pathname === '/history'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                          : ''
                      }`}
                    >
                      <History className="w-5 h-5 mr-3" />
                      History
                    </Button>
                  </Link>
                </nav>

                {/* User Info (if signed in) */}
                {mounted && isSignedIn && user && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {user.firstName || 'User'} {user.lastName || ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
