import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderSummary } from '@/types/history';

interface OrderHistoryStore {
  orders: Record<string, Order>;
  
  // Actions
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  getAllOrders: (userId: string) => OrderSummary[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  getOrdersByConversation: (conversationId: string) => Order[];
}

export const useOrderHistoryStore = create<OrderHistoryStore>()(
  persist(
    (set, get) => ({
      orders: {},

      addOrder: (order: Order) => {
        set(state => ({
          orders: {
            ...state.orders,
            [order.id]: order,
          },
        }));
      },

      getOrder: (id: string) => {
        return get().orders[id];
      },

      getAllOrders: (userId: string) => {
        const orders = Object.values(get().orders)
          .filter(order => order.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return orders.map(order => ({
          id: order.id,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          conversationId: order.conversationId,
          firstItemName: order.items[0]?.food?.name,
        }));
      },

      updateOrderStatus: (id: string, status: Order['status']) => {
        set(state => {
          const order = state.orders[id];
          if (!order) return state;
          
          return {
            orders: {
              ...state.orders,
              [id]: {
                ...order,
                status,
              },
            },
          };
        });
      },

      deleteOrder: (id: string) => {
        set(state => {
          const { [id]: removed, ...rest } = state.orders;
          return { orders: rest };
        });
      },

      getOrdersByConversation: (conversationId: string) => {
        return Object.values(get().orders)
          .filter(order => order.conversationId === conversationId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
    }),
    {
      name: 'order-history-storage',
    }
  )
);
