/* eslint-disable @next/next/no-img-element */
import type { Language } from "@/modules/catalog/domain/product";

import { formatPrice } from "../format-price";
import type { CartLine, StoreCopy } from "./cart-types";

type CartItemProps = {
  line: CartLine;
  lang: Language;
  copy: StoreCopy;
  onSetQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
};

export function CartItem({ line, lang, copy, onSetQty, onRemove }: CartItemProps) {
  const { product, qty } = line;
  const atMinimum = qty <= product.minOrder;

  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-[#3C2317]/10 bg-white p-3">
      <img src={product.image} alt={product.name[lang]} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      <div className="flex-grow">
        <h4 className="text-sm font-black uppercase leading-tight text-[#3C2317]">{product.name[lang]}</h4>
        <p className="mb-2 text-xs font-bold text-[#3C2317]/50">
          {formatPrice(product.price)} · {copy.cartMinLabel} {product.minOrder} {copy.cartUnits}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border-2 border-[#3C2317]/10 bg-[#FDFBF7] p-1">
            <button
              type="button"
              aria-label={copy.cartQty}
              disabled={atMinimum}
              onClick={() => onSetQty(product.id, qty - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#3C2317] transition-colors hover:bg-[#FFDC39] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <i className="ph ph-minus text-sm" />
            </button>
            <span className="min-w-7 text-center text-sm font-black text-[#3C2317]">{qty}</span>
            <button
              type="button"
              aria-label={copy.cartQty}
              onClick={() => onSetQty(product.id, qty + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#3C2317] transition-colors hover:bg-[#FFDC39]"
            >
              <i className="ph ph-plus text-sm" />
            </button>
          </div>
          <span className="font-black text-[#FF9B71]">{formatPrice(product.price * qty)}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label={`${copy.cartQty} 0`}
        onClick={() => onRemove(product.id)}
        className="self-start p-1 text-red-400 transition-colors hover:text-red-600"
      >
        <i className="ph ph-trash text-lg" />
      </button>
    </div>
  );
}
