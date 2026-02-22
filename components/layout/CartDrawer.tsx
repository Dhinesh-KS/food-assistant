"use client";

import { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartSummary } from '@/components/chat/dynamic/CartSummary';
import { CheckoutForm } from '@/components/chat/dynamic/CheckoutForm';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleOrderSubmit = (orderData: any) => {
    setOrderConfirmed(true);
    setTimeout(() => {
      onClose();
      setShowCheckout(false);
      setOrderConfirmed(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-2">
                {orderConfirmed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : showCheckout ? (
                  <Truck className="w-6 h-6" />
                ) : (
                  <ShoppingBag className="w-6 h-6" />
                )}
                <h2 className="text-xl font-bold">
                  {orderConfirmed ? 'Order Confirmed!' : showCheckout ? 'Checkout' : 'Your Cart'}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4">
              {orderConfirmed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
                  >
                    Order Placed Successfully!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-lg mb-2"
                  >
                    Your delicious food is on its way! 🎉
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-400">
                      <Truck className="w-5 h-5" />
                      <p className="font-semibold">Expected delivery: 30-45 minutes</p>
                    </div>
                  </motion.div>
                </motion.div>
              ) : showCheckout ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowCheckout(false)}
                    className="mb-4 hover:bg-orange-50 dark:hover:bg-orange-950"
                  >
                    ← Back to Cart
                  </Button>
                  <CheckoutForm onSubmit={handleOrderSubmit} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartSummary
                    showCheckoutButton={true}
                    onCheckout={handleCheckout}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
