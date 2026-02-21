"use client";

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the Full-Stack Engineer Assignment
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Powered by Groq AI • Next.js • TypeScript
        </p>
      </div>
    </footer>
  );
}
