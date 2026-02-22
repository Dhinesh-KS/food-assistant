import { Message } from '@/components/chat/ChatInterface';
import { CartItem } from '@/store/cart';

export interface Conversation {
  id: string;
  userId: string;
  title: string; // Auto-generated from first message or user-set
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  orderId?: string; // Links to order if placed
  itemsDiscussed: number[]; // Food IDs mentioned in chat
  totalMessages: number;
}

export interface Order {
  id: string;
  userId: string;
  conversationId?: string; // Links back to conversation
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
