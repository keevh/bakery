export type AdminOrderStatus = "pending" | "baking" | "ready" | "delivered" | "cancelled";

export type AdminOrderItem = {
  productName: string;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  client: string;
  date: string;
  amount: number;
  status: AdminOrderStatus;
  contactChannel: "email" | "phone" | "whatsapp";
  contactValue: string;
  notes: string;
  items: AdminOrderItem[];
};
