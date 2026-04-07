import type { AdminOrderStatus } from "@/modules/admin/domain/admin-order";
import { ensureBakeryBootstrap } from "@/modules/bootstrap/application/ensure-bakery-bootstrap";

import { DbOrderRepository } from "../infrastructure/db-order-repository";

const orderRepository = new DbOrderRepository();

const allowedStatuses = new Set<AdminOrderStatus>(["pending", "baking", "ready", "delivered", "cancelled"]);

export async function updateOrderStatus(formData: FormData) {
  await ensureBakeryBootstrap();

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const status = String(formData.get("status") ?? "") as AdminOrderStatus;

  if (!orderNumber) {
    throw new Error("Order number is required.");
  }

  if (!allowedStatuses.has(status)) {
    throw new Error("Invalid order status.");
  }

  await orderRepository.updateStatus(orderNumber, status);
}
