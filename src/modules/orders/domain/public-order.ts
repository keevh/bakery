export type PublicOrderContactChannel = "email" | "phone" | "whatsapp";

export type PublicOrderItemInput = {
  productId: number;
  quantity: number;
};

export type CreatePublicOrderCommand = {
  customerName: string;
  contactChannel: PublicOrderContactChannel;
  contactValue: string;
  deliveryDate: string;
  notes: string | null;
  items: PublicOrderItemInput[];
};

export type CreatePublicOrderResult = {
  orderNumber: string;
  total: number;
  status: "pending";
};

export class PublicOrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicOrderValidationError";
  }
}
