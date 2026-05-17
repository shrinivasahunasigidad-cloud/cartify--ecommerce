
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) throw new Error('Please login first');
    const existingItem = cartItems.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      await updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const { error } = await supabase.from('cart').insert({
        user_id: user.id,
        product_id: product.id,
        quantity,
      });
      if (error) throw error;
      await fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) throw new Error('Please login first');
    const item = cartItems.find((item) => item.product_id === productId);
    if (item) {
      const { error } = await supabase.from('cart').delete().eq('id', item.id);
      if (error) throw error;
      await fetchCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) throw new Error('Please login first');
    const item = cartItems.find((item) => item.product_id === productId);
    if (item) {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('id', item.id);
        if (error) throw error;
        await fetchCart();
      }
    }
  };

  const clearCart = async () => {
    if (!user) throw new Error('Please login first');
    const { error } = await supabase.from('cart').delete().eq('user_id', user.id);
    if (error) throw error;
    await fetchCart();
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price_inr || item.product.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
