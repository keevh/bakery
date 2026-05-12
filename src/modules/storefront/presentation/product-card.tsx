/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import type { Language, Product } from "@/modules/catalog/domain/product";
import type { StoreCopy } from "@/modules/storefront/presentation/cart/cart-types";

import { formatPrice } from "./format-price";

type ProductCardProps = {
  product: Product;
  lang: Language;
  copy: StoreCopy;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, lang, copy, onAdd }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const isAvailable = product.isActive;

  function handleAdd() {
    if (!isAvailable) return;
    onAdd(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div
      className={`flex flex-col rounded-[2rem] border-2 border-[#3C2317]/5 bg-white p-4 text-center shadow-sm transition-all ${
        isAvailable ? "hover:-translate-y-2 hover:border-[#3C2317]/20" : "opacity-60"
      }`}
    >
      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-[1.5rem] bg-stone-100">
        <img src={product.image} alt={product.name[lang]} className={`h-full w-full object-cover ${isAvailable ? "" : "grayscale"}`} />
        {!isAvailable ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#3C2317] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            {copy.cardUnavailable}
          </span>
        ) : null}
      </div>
      <h3 className="mb-1 text-lg font-black uppercase leading-tight text-[#3C2317]">{product.name[lang]}</h3>
      <p className="mb-2 line-clamp-2 px-2 text-xs font-medium text-[#3C2317]/60">{product.description[lang]}</p>
      <span className="mx-auto mb-3 inline-block rounded-full bg-[#3C2317]/5 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#3C2317]/70">
        {copy.cartMinLabel} {product.minOrder} {copy.cartUnits}
      </span>
      <div className="mt-auto flex w-full items-center justify-between">
        <span className="text-xl font-black text-[#FF9B71]">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable}
          aria-label={copy.btnOrder}
          className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-white transition-colors ${
            !isAvailable
              ? "cursor-not-allowed bg-stone-300"
              : justAdded
                ? "bg-[#4ADE80]"
                : "bg-[#3C2317] hover:bg-[#8B5CF6]"
          }`}
        >
          <i className={`ph ${!isAvailable ? "ph-prohibit" : justAdded ? "ph-check" : "ph-plus"} text-lg`} />
        </button>
      </div>
    </div>
  );
}
