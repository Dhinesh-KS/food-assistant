import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, ConversationSummary } from '@/lib/history/types';
import { Message } from '@/components/chat/ChatInterface';

interface ConversationStore {
  currentConversationId: string | null;
  conversations: Record<string, Conversation>;
  
  // Actions
  createConversation: (userId: string) => string;
  updateConversation: (id: string, messages: Message[], itemsDiscussed: number[]) => void;
  linkOrderToConversation: (conversationId: string, orderId: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  getAllConversations: (userId: string) => ConversationSummary[];
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  getCurrentConversation: () => Conversation | undefined;
  getMostRecentConversation: (userId: string) => Conversation | undefined;
}

const conversationNamePrefixes = [
  'Spicy', 'Delicious', 'Tasty', 'Savory', 'Sweet', 'Crispy', 'Juicy', 'Fresh',
  'Golden', 'Zesty', 'Tangy', 'Rich', 'Creamy', 'Smoky', 'Aromatic', 'Flavorful'
];

const conversationNameSuffixes = [
  'Feast', 'Cravings', 'Journey', 'Adventure', 'Discovery', 'Delight', 'Experience',
  'Quest', 'Exploration', 'Selection', 'Choices', 'Picks', 'Favorites', 'Treats'
];

const generateRandomConversationName = (): string => {
  const prefix = conversationNamePrefixes[Math.floor(Math.random() * conversationNamePrefixes.length)];
  const suffix = conversationNameSuffixes[Math.floor(Math.random() * conversationNameSuffixes.length)];
  return `${prefix} ${suffix}`;
};

const generateConversationTitle = (messages: Message[]): string => {
  if (messages.length === 0) return 'New Conversation';
  
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const text = firstUserMessage.content.substring(0, 50);
    return text.length < firstUserMessage.content.length ? `${text}...` : text;
  }
  
  return 'New Conversation';
};

const extractFoodIds = (messages: Message[]): number[] => {
  const foodIds: number[] = [];
  
  messages.forEach(message => {
    if (message.role === 'assistant' && message.uiComponents) {
      message.uiComponents.forEach(component => {
        const props = component.props as any;
        if (props && typeof props === 'object') {
          if (props.id && typeof props.id === 'number') {
            foodIds.push(props.id);
          }
          if (props.foods && Array.isArray(props.foods)) {
            props.foods.forEach((food: any) => {
              if (food.id && typeof food.id === 'number') {
                foodIds.push(food.id);
              }
            });
          }
        }
      });
    }
  });
  
  return Array.from(new Set(foodIds));
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      currentConversationId: null,
      conversations: {},

      createConversation: (userId: string) => {
        const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        
        const newConversation: Conversation = {
          id,
          userId,
          title: generateRandomConversationName(),
          messages: [],
          createdAt: now,
          updatedAt: now,
          itemsDiscussed: [],
          totalMessages: 0,
        };
        
        set(state => ({
          conversations: {
            ...state.conversations,
            [id]: newConversation,
          },
          currentConversationId: id,
        }));
        
        return id;
      },

      updateConversation: (id: string, messages: Message[], itemsDiscussed: number[]) => {
        set(state => {
          const conversation = state.conversations[id];
          if (!conversation) return state;
          
          // Keep the original random title, don't overwrite it
          const extractedIds = extractFoodIds(messages);
          const allFoodIds = Array.from(new Set([...itemsDiscussed, ...extractedIds]));
          
          return {
            conversations: {
              ...state.conversations,
              [id]: {
                ...conversation,
                messages,
                itemsDiscussed: allFoodIds,
                totalMessages: messages.length,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      linkOrderToConversation: (conversationId: string, orderId: string) => {
        set(state => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;
          
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                orderId,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      getConversation: (id: string) => {
        return get().conversations[id];
      },

      getCurrentConversation: () => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return undefined;
        return conversations[currentConversationId];
      },

      getAllConversations: (userId: string) => {
        const conversations = Object.values(get().conversations)
          .filter(conv => conv.userId === userId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        return conversations.map(conv => ({
          id: conv.id,
          title: conv.title,
          lastMessage: conv.messages[conv.messages.length - 1]?.content.substring(0, 100) || '',
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          messageCount: conv.totalMessages,
          hasOrder: !!conv.orderId,
          orderId: conv.orderId,
        }));
      },

      deleteConversation: (id: string) => {
        set(state => {
          const { [id]: removed, ...rest } = state.conversations;
          return {
            conversations: rest,
            currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
          };
        });
      },

      setCurrentConversation: (id: string | null) => {
        set({ currentConversationId: id });
      },

      getMostRecentConversation: (userId: string) => {
        const { conversations } = get();
        const userConversations = Object.values(conversations)
          .filter(conv => conv.userId === userId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        return userConversations[0];
      },
    }),
    {
      name: 'conversation-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
