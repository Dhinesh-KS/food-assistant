"use client";

import { useUser } from '@clerk/nextjs';
import { useConversationStore } from '@/store/conversation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, ShoppingBag, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function ConversationHistory() {
  const { user } = useUser();
  const { getAllConversations, deleteConversation, setCurrentConversation } = useConversationStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to view your conversation history</p>
      </div>
    );
  }

  const conversations = getAllConversations(user.id);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground mb-4">
            Start chatting with our AI assistant to get personalized food recommendations
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              Start a Conversation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleResumeConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
  };

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  return (
    <div className="overflow-y-auto h-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {conversations.map((conv) => (
          <Card
            key={conv.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <MessageSquare className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <h3 className="font-semibold text-sm line-clamp-2">{conv.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {conv.lastMessage && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {conv.lastMessage}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </div>
                <div>{conv.messageCount} messages</div>
              </div>

              {conv.hasOrder && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mb-3">
                  <ShoppingBag className="w-3 h-3" />
                  Order placed
                </div>
              )}

              <Link href="/" onClick={() => handleResumeConversation(conv.id)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Resume Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
