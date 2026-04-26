export const VOLUME_DISCOUNT_THRESHOLD = 100;
export const VOLUME_DISCOUNT_RATE = 0.15;

export type OrderPricing = {
  subtotal: number;
  discountRate: number;
  discount: number;
  total: number;
};

function roundCurrency(amount: number) {
  return Math.round(amount * 100) / 100;
}

/**
 * Volume discount: orders with a subtotal strictly greater than $100 get 15% off.
 * Single source of truth shared by the storefront cart and the server-side order creation.
 */
export function applyVolumeDiscount(subtotal: number): OrderPricing {
  const safeSubtotal = roundCurrency(Math.max(subtotal, 0));
  const discountRate = safeSubtotal > VOLUME_DISCOUNT_THRESHOLD ? VOLUME_DISCOUNT_RATE : 0;
  const discount = roundCurrency(safeSubtotal * discountRate);
  const total = roundCurrency(safeSubtotal - discount);

  return {
    subtotal: safeSubtotal,
    discountRate,
    discount,
    total,
  };
}
