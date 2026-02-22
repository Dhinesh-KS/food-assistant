"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCartStore } from '@/store/cart';

export function CartSync() {
  const { user, isLoaded } = useUser();
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    if (isLoaded) {
      syncCart(user?.id || null);
    }
  }, [user?.id, isLoaded, syncCart]);

  return null;
}
