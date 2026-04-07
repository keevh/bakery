import type { LocalizedText } from "@/modules/catalog/domain/product";

import type { PublicOrderContactChannel } from "./public-order";

export type PublicOrderProductSnapshot = {
  id: number;
  name: LocalizedText;
  price: number;
  minOrder: number;
  isActive: boolean;
};

export type CreatePublicOrderRecord = {
  customerName: string;
  contactChannel: PublicOrderContactChannel;
  contactValue: string;
  deliveryDate: string;
  notes: string | null;
  total: number;
  items: Array<{
    productId: number;
    productName: LocalizedText;
    unitPrice: number;
    quantity: number;
  }>;
};

export interface PublicOrderRepository {
  create(order: CreatePublicOrderRecord): Promise<{ orderNumber: string }>;
}
