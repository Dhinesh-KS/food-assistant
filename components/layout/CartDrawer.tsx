"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {orderConfirmed ? 'Order Confirmed!' : showCheckout ? 'Checkout' : 'Your Cart'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4">
              {orderConfirmed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
                  <p className="text-muted-foreground">
                    Your delicious food is on its way!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Expected delivery: 30-45 minutes
                  </p>
                </motion.div>
              ) : showCheckout ? (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCheckout(false)}
                    className="mb-4"
                  >
                    ← Back to Cart
                  </Button>
                  <CheckoutForm onSubmit={handleOrderSubmit} />
                </div>
              ) : (
                <CartSummary
                  showCheckoutButton={true}
                  onCheckout={handleCheckout}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
