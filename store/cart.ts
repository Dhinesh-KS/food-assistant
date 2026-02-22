import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Food } from '@/types/food';

interface CartStore {
  items: CartItem[];
  userId: string | null;
  addItem: (food: Food, quantity?: number) => void;
  removeItem: (foodId: number) => void;
  updateQuantity: (foodId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setUserId: (userId: string | null) => void;
  syncCart: (userId: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      
      setUserId: (userId: string | null) => {
        set({ userId });
      },
      
      syncCart: (userId: string | null) => {
        const currentUserId = get().userId;
        
        // If user changed (login/logout), clear cart
        if (currentUserId !== userId) {
          set({ items: [], userId });
        }
      },
      
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
      partialize: (state) => ({
        items: state.items,
        userId: state.userId,
      }),
    }
  )
);
