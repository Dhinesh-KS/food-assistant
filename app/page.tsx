import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/views/chat/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
