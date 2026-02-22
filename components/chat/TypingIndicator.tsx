"use client";

import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md"
      >
        <ChefHat className="w-5 h-5 text-white" />
      </motion.div>
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl rounded-tl-none px-5 py-4 max-w-xs shadow-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2.5 h-2.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2 text-xs text-orange-600 font-medium"
          >
            Thinking...
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
