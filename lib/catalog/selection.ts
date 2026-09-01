'use client';

import { useCallback, useEffect, useState } from 'react';

const CART_KEY = 'safer-cart';
const COMPARE_KEY = 'safer-compare';
const EVENT = 'safer-selection-change';
export const COMPARE_MAX = 4;

type Cart = Record<string, number>;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
}

/** Cart (product id → quantity) and compare list shared across the Store, persisted per browser. */
export function useSelection() {
  const [cart, setCart] = useState<Cart>({});
  const [compare, setCompare] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCart(read<Cart>(CART_KEY, {}));
      setCompare(read<string[]>(COMPARE_KEY, []));
    };
    sync();
    queueMicrotask(() => setReady(true));
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addToCart = useCallback((id: string) => {
    const current = read<Cart>(CART_KEY, {});
    write(CART_KEY, { ...current, [id]: Math.min((current[id] || 0) + 1, 9) });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const current = read<Cart>(CART_KEY, {});
    delete current[id];
    write(CART_KEY, current);
  }, []);

  const clearCart = useCallback(() => write(CART_KEY, {}), []);

  const toggleCompare = useCallback((id: string) => {
    const current = read<string[]>(COMPARE_KEY, []);
    if (current.includes(id)) write(COMPARE_KEY, current.filter((item) => item !== id));
    else if (current.length < COMPARE_MAX) write(COMPARE_KEY, [...current, id]);
  }, []);

  const clearCompare = useCallback(() => write(COMPARE_KEY, []), []);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  return { ready, cart, cartCount, compare, addToCart, removeFromCart, clearCart, toggleCompare, clearCompare };
}
