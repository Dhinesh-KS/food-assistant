"use client";

import { useUser } from '@clerk/nextjs';
import { useOrderHistoryStore } from '@/store/orderHistory';
import { useCartStore } from '@/store/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, Calendar, RefreshCw, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function OrderHistory() {
  const { user } = useUser();
  const { getAllOrders, getOrder } = useOrderHistoryStore();
  const { addItem } = useCartStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to view your order history</p>
      </div>
    );
  }

  const orders = getAllOrders(user.id);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-4">
            Place your first order and it will appear here
          </p>
          <Link href="/browse">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleReorder = (orderId: string) => {
    const order = getOrder(orderId);
    if (!order) return;

    order.items.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          serves: item.serves,
          description: item.description || '',
          category: item.category || '',
          type: item.type || '',
          spiceLevel: item.spiceLevel || '',
          ingredients: item.ingredients || [],
          nutrition: item.nutrition || { calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
        },
        item.quantity
      );
    });

    toast({
      title: 'Items added to cart!',
      description: `${order.items.length} items from your previous order have been added to your cart`,
    });
  };

  return (
    <div className="overflow-y-auto h-full">
      <div className="space-y-4">
        {orders.map((orderSummary) => {
          const order = getOrder(orderSummary.id);
          if (!order) return null;

          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[order.status]} text-white`}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {order.items.length} items
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPrice(order.total)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                {order.deliveryAddress && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium">Delivery Address:</p>
                    <p>{order.deliveryAddress}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleReorder(order.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                  {order.conversationId && (
                    <Link href="/" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Chat
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
