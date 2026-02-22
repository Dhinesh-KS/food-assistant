import { Header } from '@/components/layout/Header';
import { CartPage } from '@/components/cart/CartPage';

export default function Cart() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <CartPage />
      </main>
    </div>
  );
}
