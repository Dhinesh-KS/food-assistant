import { Header } from '@/components/layout/Header';
import { BrowseView } from '@/components/browse/BrowseView';

export default function BrowsePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <BrowseView />
      </main>
    </div>
  );
}
