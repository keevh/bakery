import { formatPrice } from "../format-price";
import type { StoreCopy } from "./cart-types";

type CartSummaryProps = {
  subtotal: number;
  discount: number;
  total: number;
  copy: StoreCopy;
};

export function CartSummary({ subtotal, discount, total, copy }: CartSummaryProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold text-[#3C2317]/60">
        <span>{copy.cartSubtotal}</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 ? (
        <div className="flex items-start justify-between gap-3 text-sm font-bold text-[#16A34A]">
          <span className="flex flex-col">
            {copy.cartDiscount}
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#3C2317]/40">{copy.cartDiscountHint}</span>
          </span>
          <span>-{formatPrice(discount)}</span>
        </div>
      ) : null}
      <div className="flex items-end justify-between pt-2">
        <span className="text-sm font-bold uppercase text-[#3C2317]/60">{copy.cartTotal}</span>
        <span className="text-3xl font-black leading-none text-[#3C2317]">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
