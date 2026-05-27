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
  contactChannel: "email" | "cell";
  contactValue: string;
  address: string;
  notes: string;
  items: AdminOrderItem[];
};
