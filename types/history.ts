import { Message } from '@/types/chat';
import { CartItem } from '@/types/food';

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  itemsDiscussed: number[];
  totalMessages: number;
}

export interface Order {
  id: string;
  userId: string;
  conversationId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  hasOrder: boolean;
  orderId?: string;
}

export interface OrderSummary {
  id: string;
  itemCount: number;
  total: number;
  status: Order['status'];
  createdAt: string;
  conversationId?: string;
  firstItemName?: string;
}
