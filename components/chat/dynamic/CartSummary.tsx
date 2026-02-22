"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  message?: string;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export function CartSummary({ message, showCheckoutButton = true, onCheckout }: CartSummaryProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Start adding some delicious items!</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = getTotal();
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + deliveryFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Cart</CardTitle>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.food.id} className="flex gap-3 pb-3 border-b last:border-0">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={`/${item.food.image}`}
                alt={item.food.name}
                fill
                className="object-cover"
                sizes="64px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-food.svg';
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{item.food.name}</h4>
              <p className="text-sm text-primary font-semibold">{formatPrice(item.food.price)}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => removeItem(item.food.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">{formatPrice(item.food.price * item.quantity)}</p>
            </div>
          </div>
        ))}
        
        <div className="space-y-2 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
        
        {showCheckoutButton && (
          <Button onClick={onCheckout} className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
