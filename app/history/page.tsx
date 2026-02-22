import { Header } from '@/components/layout/Header';
import { HistoryView } from '@/components/history/HistoryView';

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <HistoryView />
      </main>
    </div>
  );
}
