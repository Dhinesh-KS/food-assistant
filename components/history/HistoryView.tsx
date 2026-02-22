"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationHistory } from './ConversationHistory';
import { OrderHistory } from './OrderHistory';
import { MessageSquare, ShoppingBag } from 'lucide-react';

export function HistoryView() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'orders' ? 'orders' : 'conversations');

  useEffect(() => {
    if (tabParam === 'orders') {
      setActiveTab('orders');
    }
  }, [tabParam]);

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            History
          </h1>
          <p className="text-muted-foreground mt-1">
            View your past conversations and orders
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="flex-1 overflow-hidden mt-6">
            <ConversationHistory />
          </TabsContent>

          <TabsContent value="orders" className="flex-1 overflow-hidden mt-6">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
