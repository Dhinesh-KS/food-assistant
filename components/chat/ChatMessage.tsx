"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ComponentSchema, ActionSchema } from '@/components/widgets/schema';
import { ComponentRenderer } from '@/components/widgets/renderer';
import { ChefHat, User, Copy, Volume2, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleLike = () => {
    setIsLiked(isLiked === true ? null : true);
    toast({
      title: isLiked === true ? "Feedback removed" : "Thanks for your feedback!",
      description: isLiked === true ? "" : "Glad you found this helpful",
    });
  };

  const handleDislike = () => {
    setIsLiked(isLiked === false ? null : false);
    toast({
      title: isLiked === false ? "Feedback removed" : "Thanks for your feedback!",
      description: isLiked === false ? "" : "We'll work on improving our responses",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
        >
          <ChefHat className="w-5 h-5 text-white" />
        </motion.div>
      )}
      
      <div className={cn("flex flex-col gap-3", isUser ? "items-end" : "items-start", "max-w-[85%] md:max-w-[75%]")}>
        {content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-1 w-full"
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-3 shadow-md transition-all hover:shadow-lg",
                isUser
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none"
                  : "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border border-orange-200 dark:border-orange-800 rounded-tl-none text-foreground"
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
            </div>
            <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
              {!isUser && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    onClick={handleCopy}
                    title="Copy message"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-orange-600" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    onClick={handleSpeak}
                    title={isSpeaking ? "Stop speaking" : "Read aloud"}
                  >
                    <Volume2 className={cn(
                      "w-3.5 h-3.5",
                      isSpeaking ? "text-orange-600" : "text-muted-foreground hover:text-orange-600"
                    )} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
                    onClick={handleLike}
                    title="Helpful"
                  >
                    <ThumbsUp className={cn(
                      "w-3.5 h-3.5",
                      isLiked === true ? "text-green-600 fill-green-600" : "text-muted-foreground hover:text-green-600"
                    )} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={handleDislike}
                    title="Not helpful"
                  >
                    <ThumbsDown className={cn(
                      "w-3.5 h-3.5",
                      isLiked === false ? "text-red-600 fill-red-600" : "text-muted-foreground hover:text-red-600"
                    )} />
                  </Button>
                </div>
              )}
              
              <span className="text-xs text-muted-foreground/70 px-1 font-medium">
                {formattedTime}
              </span>
            </div>
          </motion.div>
        )}
        
        {component && !isUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-1"
          >
            <ComponentRenderer 
              schema={component} 
              onAction={onAction}
              onQuantityChange={onQuantityChange}
            />
          </motion.div>
        )}
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md"
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
