"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Leaf, Flame, ShoppingCart, Info, X } from 'lucide-react';
import { Food } from '@/lib/food/types';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  console.log(`FoodCard ${food.name} - Modal state:`, isModalOpen);

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('Card clicked, opening modal', e.target);
    console.log('Current modal state:', isModalOpen);
    setIsModalOpen(true);
    console.log('Modal state set to true');
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Details button clicked');
    setIsModalOpen(true);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem(food, quantity);
    toast({
      title: "Added to cart! 🎉",
      description: `${quantity}x ${food.name} added to your cart`,
    });
    setQuantity(1);
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 h-full"
      >
          <div 
            className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group cursor-pointer"
            onClick={handleCardClick}
          >
            <Image
              src={`/${food.image}`}
              alt={food.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-food.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Info className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-bold text-lg mb-1 text-gray-900 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors"
                  onClick={handleCardClick}
                >
                  {food.name}
                </h3>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {food.type === 'Vegetarian' && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border border-green-300 text-xs">
                      <Leaf className="w-3 h-3 mr-1" />
                      Veg
                    </Badge>
                  )}
                  {food.spiceLevel && food.spiceLevel !== 'Neutral' && (
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                      <Flame className="w-3 h-3 mr-1" />
                      {food.spiceLevel}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent whitespace-nowrap">
                  {formatPrice(food.price)}
                </p>
                <p className="text-xs text-muted-foreground font-medium whitespace-nowrap">Serves {food.serves}</p>
              </div>
            </div>
            
            <div className="mb-2">
              <Badge variant="outline" className="text-xs border-gray-300">
                {food.category}
              </Badge>
            </div>
            
            <div 
              className="text-sm text-muted-foreground mb-3 leading-relaxed overflow-hidden cursor-pointer hover:text-foreground transition-colors" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
              onClick={handleCardClick}
            >
              {food.description}
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 mb-3">
              <p className="text-xs font-bold mb-2 text-orange-900">Nutrition (per serving)</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground truncate">Cal</p>
                  <p className="font-bold text-orange-700 truncate">{food.nutrition.calories}</p>
                </div>
                <div>
                  <p className="text-muted-foreground truncate">Protein</p>
                  <p className="font-bold text-orange-700 truncate">{food.nutrition.protein}</p>
                </div>
                <div>
                  <p className="text-muted-foreground truncate">Carbs</p>
                  <p className="font-bold text-orange-700 truncate">{food.nutrition.carbs}</p>
                </div>
                <div>
                  <p className="text-muted-foreground truncate">Fat</p>
                  <p className="font-bold text-orange-700 truncate">{food.nutrition.fat}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDetailsClick}
                className="text-xs"
              >
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-orange-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-orange-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.min(10, quantity + 1));
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-semibold shadow-md"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

      {isModalOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 pr-10">
            {food.name}
          </h2>
          
          <div className="space-y-4 relative">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={`/${food.image}`}
                alt={food.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-food.svg';
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {food.type === 'Vegetarian' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border border-green-300">
                    <Leaf className="w-3 h-3 mr-1" />
                    Vegetarian
                  </Badge>
                )}
                {food.spiceLevel && (
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    <Flame className="w-3 h-3 mr-1" />
                    {food.spiceLevel}
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-300">
                  {food.category}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {formatPrice(food.price)}
                </p>
                <p className="text-sm text-muted-foreground">Serves {food.serves}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{food.description}</p>
            </div>

            {food.ingredients && food.ingredients.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-lg mb-3">Nutritional Information</h3>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Calories</p>
                    <p className="text-2xl font-bold text-orange-700">{food.nutrition.calories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Protein</p>
                    <p className="text-2xl font-bold text-orange-700">{food.nutrition.protein}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-orange-700">{food.nutrition.carbs}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Fat</p>
                    <p className="text-2xl font-bold text-orange-700">{food.nutrition.fat}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-orange-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-orange-100"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-bold shadow-lg text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - {formatPrice(food.price * quantity)}
              </Button>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}
