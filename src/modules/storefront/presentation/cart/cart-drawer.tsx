"use client";

import Link from "next/link";

import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { useMounted } from "../use-mounted";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

export function CartDrawer() {
  const { lang, cart, isCartOpen, closeCart, setQty, removeFromCart, getCartSubtotal, getCartDiscount, getCartTotal } =
    useStorefrontStore();
  const copy = storefrontCopy[lang];
  const mounted = useMounted();
  const hasItems = mounted && cart.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[#3C2317]/40 backdrop-blur-sm" onClick={closeCart} />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md transform flex-col border-l-4 border-[#3C2317] bg-[#FDFBF7] shadow-2xl transition-transform duration-500 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-[#3C2317]/10 bg-[#FFDC39] p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.cartTitle}</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={copy.cartKeepShopping}
            className="rounded-full border-2 border-[#3C2317] bg-white p-1 text-[#3C2317] transition-transform hover:scale-110"
          >
            <i className="ph ph-x text-lg" />
          </button>
        </div>

        <div className="flex-grow space-y-3 overflow-y-auto p-6">
          {hasItems ? (
            cart.map((line) => (
              <CartItem key={line.product.id} line={line} lang={lang} copy={copy} onSetQty={setQty} onRemove={removeFromCart} />
            ))
          ) : (
            <div className="mt-20 flex flex-col items-center text-center text-[#3C2317]/30">
              <i className="ph ph-shopping-bag mb-4 text-6xl" />
              <p className="font-bold uppercase">{copy.cartEmpty}</p>
            </div>
          )}
        </div>

        {hasItems ? (
          <div className="border-t-2 border-[#3C2317]/10 bg-white p-6">
            <div className="mb-4">
              <CartSummary subtotal={getCartSubtotal()} discount={getCartDiscount()} total={getCartTotal()} copy={copy} />
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3C2317] p-4 font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-colors hover:bg-[#FF9B71]"
            >
              {copy.cartContinue} <i className="ph ph-arrow-right text-xl" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
