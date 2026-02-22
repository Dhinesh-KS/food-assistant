"use client";

import { FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, CornerDownLeft } from 'lucide-react';

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const MAX_CHARS = 512;

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim() && !isOverLimit) {
        // Create a synthetic form event
        const formEvent = {
          preventDefault: () => {},
          currentTarget: e.currentTarget.form,
        } as FormEvent<HTMLFormElement>;
        handleSubmit(formEvent);
      }
    }
    // Allow Shift+Enter for new line (default behavior)
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about our menu..."
        disabled={isLoading}
        className="w-full min-h-[100px] resize-none pr-24 pb-10 shadow-lg focus:shadow-xl transition-shadow border-2"
        rows={3}
        maxLength={MAX_CHARS}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'} flex items-center gap-1`}>
          <CornerDownLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Enter to send</span>
          <span className="mx-1">•</span>
          {charCount}/{MAX_CHARS}
        </span>
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim() || isOverLimit} 
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
