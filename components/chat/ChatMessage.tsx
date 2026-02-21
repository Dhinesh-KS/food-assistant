"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ComponentSchema, ActionSchema } from '@/lib/components/schema';
import { ComponentRenderer } from '@/lib/components/renderer';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  component?: ComponentSchema;
  onAction?: (action: ActionSchema) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
}

export function ChatMessage({ 
  role, 
  content, 
  timestamp,
  component,
  onAction,
  onQuantityChange 
}: ChatMessageProps) {
  const isUser = role === 'user';

  // Format timestamp
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-lg">🤖</span>
        </div>
      )}
      
      <div className={cn("flex flex-col gap-3", isUser ? "items-end" : "items-start", "max-w-[85%] md:max-w-[75%]")}>
        {content && (
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                "rounded-2xl px-4 py-3 shadow-sm",
                isUser
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
            </div>
            <span className={cn(
              "text-xs text-muted-foreground/70 px-1",
              isUser ? "text-right" : "text-left"
            )}>
              {formattedTime}
            </span>
          </div>
        )}
        
        {component && !isUser && (
          <div className="w-full mt-1">
            <ComponentRenderer 
              schema={component} 
              onAction={onAction}
              onQuantityChange={onQuantityChange}
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-lg">👤</span>
        </div>
      )}
    </motion.div>
  );
}
