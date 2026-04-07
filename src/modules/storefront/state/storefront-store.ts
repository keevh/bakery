"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/modules/catalog/domain/product";

type CartItem = {
  product: Product;
  qty: number;
};

type StorefrontState = {
  lang: "es" | "en";
  cart: CartItem[];
  isCartOpen: boolean;
  setLang: (lang: "es" | "en") => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

export const useStorefrontStore = create<StorefrontState>()(
  persist(
    (set, get) => ({
      lang: "es",
      cart: [],
      isCartOpen: false,
      setLang: (lang) => set({ lang }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);

          if (!existing) {
            return {
              cart: [...state.cart, { product, qty: product.minOrder }],
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.product.id === product.id
                ? { ...item, qty: item.qty + item.product.minOrder }
                : item,
            ),
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () =>
        get().cart.reduce((sum, item) => {
          return sum + item.product.price * item.qty;
        }, 0),
    }),
    {
      name: "rollin-storefront",
      partialize: (state) => ({
        lang: state.lang,
        cart: state.cart,
      }),
    },
  ),
);
