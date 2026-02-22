"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Leaf, Flame } from 'lucide-react';
import { Food } from '@/lib/food/types';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(food, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${food.name} added to your cart`,
    });
    setQuantity(1);
  };

  const truncatedDescription = food.description.length > 150
    ? food.description.substring(0, 150) + '...'
    : food.description;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={`/${food.image}`}
          alt={food.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-food.svg';
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{food.name}</h3>
            <div className="flex gap-2 flex-wrap mb-2">
              {food.type === 'Vegetarian' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Leaf className="w-3 h-3 mr-1" />
                  Veg
                </Badge>
              )}
              {food.spiceLevel && (
                <Badge variant="outline" className="text-xs">
                  <Flame className="w-3 h-3 mr-1" />
                  {food.spiceLevel}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {food.category}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{formatPrice(food.price)}</p>
            <p className="text-xs text-muted-foreground">Serves {food.serves}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {isExpanded ? food.description : truncatedDescription}
          {food.description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary ml-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
        
        <div className="bg-gray-50 rounded-md p-2 mb-3">
          <p className="text-xs font-semibold mb-1">Nutrition (per serving)</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Cal</p>
              <p className="font-semibold">{food.nutrition.calories}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Protein</p>
              <p className="font-semibold">{food.nutrition.protein}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carbs</p>
              <p className="font-semibold">{food.nutrition.carbs}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fat</p>
              <p className="font-semibold">{food.nutrition.fat}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCart} className="flex-1">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
