import "server-only";

import { randomUUID } from "node:crypto";

import type { PublicOrderRepository, CreatePublicOrderRecord } from "@/modules/orders/domain/public-order-repository";
import { db } from "@/modules/shared/infrastructure/db/client";
import { orderItemsTable, ordersTable } from "@/modules/shared/infrastructure/db/schema";

function generateOrderNumber() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
  const suffix = randomUUID().split("-")[0]?.toUpperCase() ?? "ROLLIN";
  return `ORD-${timestamp}-${suffix}`;
}

export class DbPublicOrderRepository implements PublicOrderRepository {
  async create(order: CreatePublicOrderRecord) {
    const orderNumber = generateOrderNumber();

    await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(ordersTable)
        .values({
          orderNumber,
          customerName: order.customerName,
          contactChannel: order.contactChannel,
          contactValue: order.contactValue,
          deliveryDate: order.deliveryDate,
          notes: order.notes,
          total: order.total.toFixed(2),
          status: "pending",
        })
        .returning({ id: ordersTable.id });

      await tx.insert(orderItemsTable).values(
        order.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice.toFixed(2),
          quantity: item.quantity,
        })),
      );
    });

    return { orderNumber };
  }
}
