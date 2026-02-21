"use client";

import { useRef, useEffect, useState, FormEvent } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQueries } from './SuggestedQueries';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentSchema, ActionSchema } from '@/lib/components/schema';
import { useCartStore } from '@/lib/cart/store';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  component?: ComponentSchema;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? {
                          ...m,
                          content: data.message,
                          component: data.component,
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

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-1">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🍽️</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">Welcome to Spice & Delight!</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  I'm your AI assistant. Ask me anything about our menu or tell me what you're
                  craving!
                </p>
                <SuggestedQueries onSelect={handleQuickAction} />
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

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <MessageInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
