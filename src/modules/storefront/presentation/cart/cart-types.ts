import type { Product } from "@/modules/catalog/domain/product";
import type { storefrontCopy } from "@/modules/storefront/content/storefront-copy";

export type StoreCopy = (typeof storefrontCopy)[keyof typeof storefrontCopy];

export type CartLine = {
  product: Product;
  qty: number;
};

export type CheckoutFormState = {
  customerName: string;
  contactChannel: "email" | "cell";
  contactValue: string;
  address: string;
  deliveryDate: string;
  notes: string;
};
