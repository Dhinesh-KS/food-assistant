import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Food } from '@/lib/food/types';

interface CartStore {
  items: CartItem[];
  addItem: (food: Food, quantity?: number) => void;
  removeItem: (foodId: number) => void;
  updateQuantity: (foodId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (food: Food, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.food.id === food.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.food.id === food.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { food, quantity }],
          };
        });
      },
      
      removeItem: (foodId: number) => {
        set((state) => ({
          items: state.items.filter(item => item.food.id !== foodId),
        }));
      },
      
      updateQuantity: (foodId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(foodId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.food.id === foodId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.food.price * item.quantity);
        }, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
