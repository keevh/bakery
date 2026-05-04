"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/modules/catalog/domain/product";
import { applyVolumeDiscount } from "@/modules/orders/domain/order-pricing";

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
  setQty: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
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

          // Already in the cart: the minimum is met, so each extra click adds one unit.
          return {
            cart: state.cart.map((item) =>
              item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
            ),
          };
        }),
      setQty: (productId, qty) =>
        set((state) => {
          const target = state.cart.find((item) => item.product.id === productId);

          if (!target) {
            return state;
          }

          // Dropping below the minimum order removes the line entirely.
          if (qty < target.product.minOrder) {
            return {
              cart: state.cart.filter((item) => item.product.id !== productId),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.product.id === productId ? { ...item, qty } : item,
            ),
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      getCartCount: () => get().cart.reduce((count, item) => count + item.qty, 0),
      getCartSubtotal: () =>
        get().cart.reduce((sum, item) => {
          return sum + item.product.price * item.qty;
        }, 0),
      getCartDiscount: () => applyVolumeDiscount(get().getCartSubtotal()).discount,
      getCartTotal: () => applyVolumeDiscount(get().getCartSubtotal()).total,
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
