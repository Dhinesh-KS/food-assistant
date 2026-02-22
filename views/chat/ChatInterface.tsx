"use client";

import { useRef, useEffect, useState, FormEvent } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { TypingIndicator } from './components/TypingIndicator';
import { SuggestedQueries } from './components/SuggestedQueries';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentSchema, ActionSchema } from '@/types/component';
import { useCartStore } from '@/store/cart';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import { useConversationStore } from '@/store/conversation';
import { Plus, History as HistoryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  component?: ComponentSchema;
  uiComponents?: ComponentSchema[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const addItem = useCartStore((state) => state.addItem);
  const { user, isSignedIn } = useUser();
  
  // Conversation management
  const {
    currentConversationId,
    createConversation,
    updateConversation,
    setCurrentConversation,
    getCurrentConversation,
    getMostRecentConversation,
  } = useConversationStore();
  
  // Initialize - check if resuming a conversation or start fresh
  useEffect(() => {
    if (!user || hasInitialized.current) return;
    
    // If there's a current conversation ID, load it (user clicked "Resume")
    if (currentConversationId) {
      const existingConv = getCurrentConversation();
      if (existingConv && existingConv.messages.length > 0) {
        setMessages(existingConv.messages);
      }
    } else {
      // Otherwise, show fresh landing page
      setMessages([]);
    }
    
    hasInitialized.current = true;
  }, [user, currentConversationId, getCurrentConversation]);
  
  // Save conversation whenever messages change
  useEffect(() => {
    if (currentConversationId && messages.length > 0 && user) {
      const itemsDiscussed: number[] = [];
      messages.forEach(msg => {
        if (msg.component && 'data' in msg.component) {
          const data = msg.component.data as any;
          if (data && typeof data === 'object' && 'id' in data) {
            itemsDiscussed.push(data.id as number);
          }
        }
        if (msg.uiComponents) {
          msg.uiComponents.forEach(comp => {
            if ('data' in comp) {
              const data = comp.data as any;
              if (data && typeof data === 'object' && 'id' in data) {
                itemsDiscussed.push(data.id as number);
              }
            }
          });
        }
      });
      updateConversation(currentConversationId, messages, itemsDiscussed);
    }
  }, [messages, currentConversationId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleAction = (action: ActionSchema) => {
    switch (action.type) {
      case 'add_to_cart':
        const { itemId, name, price, image, serves } = action.payload || {};
        const quantity = quantities[`qty-${itemId}`] || 1;
        
        addItem(
          {
            id: itemId,
            name,
            price,
            image,
            serves,
            description: '',
            category: '',
            type: '',
            spiceLevel: '',
            ingredients: [],
            nutrition: { calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
          },
          quantity
        );
        
        toast({
          title: 'Added to cart!',
          description: `${quantity}x ${name} added to your cart`,
        });
        break;
      
      case 'message':
        const messageText = action.payload?.text;
        if (messageText) {
          const fakeEvent = {
            preventDefault: () => {},
          } as FormEvent<HTMLFormElement>;
          handleSubmit(fakeEvent, { data: { message: messageText } });
        }
        break;
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    options?: { data?: { message: string } }
  ) => {
    e.preventDefault();

    const messageText = options?.data?.message || input.trim();
    if (!messageText) return;

    // Create conversation on first message if none exists
    if (!currentConversationId && user) {
      const newConvId = createConversation(user.id);
      setCurrentConversation(newConvId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      // Add empty assistant message that will be updated
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                // Update message content incrementally
                assistantMessage.content += data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: assistantMessage.content }
                      : m
                  )
                );
              } else if (data.type === 'done') {
                // Set final message and component
                const uiComponents = data.component ? [data.component] : [];
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? {
                          ...m,
                          content: data.message,
                          component: data.component,
                          uiComponents,
                        }
                      : m
                  )
                );
              } else if (data.type === 'error') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: data.message }
                      : m
                  )
                );
              }
            } catch (err) {
              console.error('Error parsing SSE data:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>;

    handleSubmit(fakeEvent, { data: { message } });
  };

  const handleNewChat = () => {
    if (!user) return;
    
    // Clear current messages and conversation
    setMessages([]);
    setCurrentConversation(null);
    
    // Show toast notification
    toast({
      title: 'New conversation started',
      description: 'Your previous conversation has been saved',
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header - Only show when messages exist */}
      {messages.length > 0 && (
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 px-4">
          <div className="max-w-4xl mx-auto py-3 flex items-center justify-between border-b">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">
                {currentConversationId ? getCurrentConversation()?.title || 'Current Conversation' : 'Current Conversation'}
              </h2>
              <p className="text-xs text-muted-foreground">{messages.length} messages</p>
            </div>
            <Button
              onClick={handleNewChat}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-semibold ml-4 flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      )}

      <div className={`flex-1 px-4 py-6 ${messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden flex items-center justify-center'}`}>
        <div className="max-w-4xl mx-auto space-y-1">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 px-4"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                >
                  {isSignedIn 
                    ? `Welcome back, ${user?.firstName || 'there'}!` 
                    : 'Welcome to Spice & Delight!'}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-lg md:text-xl mb-4 max-w-2xl mx-auto font-medium"
                >
                  {isSignedIn 
                    ? 'Ready to order your favorite dishes?' 
                    : 'Your AI-powered culinary companion'}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground text-base mb-10 max-w-xl mx-auto font-normal"
                >
                  Ask me anything about our menu, dietary preferences, or tell me what you're craving. 
                  I'll help you discover the perfect meal! 🌟
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <SuggestedQueries onSelect={handleQuickAction} />
                </motion.div>
                
                {/* Resume Conversation Link */}
                {isSignedIn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8"
                  >
                    <Link href="/history">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950"
                      >
                        <HistoryIcon className="w-4 h-4 mr-2" />
                        Resume Previous Conversation
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              component={message.component}
              onAction={handleAction}
              onQuantityChange={handleQuantityChange}
            />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 border-t">
          <MessageInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
}
