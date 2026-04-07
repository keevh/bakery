import "server-only";

import { desc, eq } from "drizzle-orm";

import type { AdminOrder, AdminOrderStatus } from "@/modules/admin/domain/admin-order";
import { db } from "@/modules/shared/infrastructure/db/client";
import { ordersTable } from "@/modules/shared/infrastructure/db/schema";

export class DbOrderRepository {
  async listAllForAdmin() {
    const records = await db.query.ordersTable.findMany({
      with: {
        items: true,
      },
      orderBy: [desc(ordersTable.deliveryDate), desc(ordersTable.createdAt)],
    });

    return records.map<AdminOrder>((record) => ({
      id: record.orderNumber,
      client: record.customerName,
      date: record.deliveryDate,
      amount: Number(record.total),
      status: record.status,
      contactChannel: record.contactChannel,
      contactValue: record.contactValue,
      notes: record.notes ?? "Sin notas.",
      items: record.items.map((item) => ({
        productName: item.productName.en,
        quantity: item.quantity,
      })),
    }));
  }

  async updateStatus(orderNumber: string, status: AdminOrderStatus) {
    const [record] = await db
      .update(ordersTable)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.orderNumber, orderNumber))
      .returning();

    return record;
  }
}
