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
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Start adding some delicious items!</p>
          <p className="text-xs text-muted-foreground mt-2">💬 Chat with our AI assistant to discover amazing dishes</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = getTotal();
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + deliveryFee;

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-orange-600" />
          Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </CardTitle>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {items.map((item) => (
          <div key={item.food.id} className="flex gap-3 pb-3 border-b last:border-0 hover:bg-orange-50/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
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
              <h4 className="font-bold text-sm truncate text-gray-900">{item.food.name}</h4>
              <p className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {formatPrice(item.food.price)}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-orange-100"
                    onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-7 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-orange-100"
                    onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600 hover:bg-red-50"
                  onClick={() => removeItem(item.food.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatPrice(item.food.price * item.quantity)}</p>
            </div>
          </div>
        ))}
        
        <div className="space-y-2 pt-3 border-t-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Tax (5%)</span>
            <span className="font-semibold">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Delivery Fee</span>
            <span className="font-semibold">{deliveryFee === 0 ? <span className="text-green-600">FREE ✓</span> : formatPrice(deliveryFee)}</span>
          </div>
          {deliveryFee > 0 && (
            <p className="text-xs text-muted-foreground">💡 Add {formatPrice(500 - subtotal)} more for free delivery!</p>
          )}
          <div className="flex justify-between font-bold text-xl pt-3 border-t-2">
            <span>Total</span>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
          </div>
        </div>
        
        {showCheckoutButton && (
          <Button 
            onClick={onCheckout} 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-bold shadow-lg" 
            size="lg"
          >
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
