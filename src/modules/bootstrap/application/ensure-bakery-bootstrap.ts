import { and, eq } from "drizzle-orm";

import { hashPassword } from "@/modules/admin/infrastructure/password-hasher";
import { catalogSeed } from "@/modules/catalog/infrastructure/catalog.seed";
import { db } from "@/modules/shared/infrastructure/db/client";
import { adminUsersTable, orderItemsTable, ordersTable, productsTable } from "@/modules/shared/infrastructure/db/schema";
import { mockAdminOrders } from "@/modules/admin/infrastructure/mock-admin-orders";

const bootstrapAdminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL ?? "correo@prueba";
const bootstrapAdminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "1234prueba";

let bootstrapPromise: Promise<void> | null = null;

async function bootstrapAdminUser() {
  const existingAdmin = await db.select({ id: adminUsersTable.id }).from(adminUsersTable).where(eq(adminUsersTable.email, bootstrapAdminEmail)).limit(1);

  if (existingAdmin.length > 0) {
    return;
  }

  const passwordHash = await hashPassword(bootstrapAdminPassword);

  await db.insert(adminUsersTable).values({
    email: bootstrapAdminEmail,
    passwordHash,
  });
}

async function bootstrapProducts() {
  for (const product of catalogSeed) {
    const existingProduct = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.slug, product.slug)).limit(1);

    if (existingProduct.length > 0) {
      continue;
    }

    await db.insert(productsTable).values({
      slug: product.slug,
      category: product.category,
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      minOrder: product.minOrder,
      image: product.image,
      isActive: product.isActive,
    });
  }
}

async function bootstrapOrders() {
  const products = await db.select().from(productsTable);
  const productsByEnglishName = new Map(products.map((product) => [product.name.en, product]));

  for (const order of mockAdminOrders) {
    const existingOrder = await db.select({ id: ordersTable.id }).from(ordersTable).where(eq(ordersTable.orderNumber, order.id)).limit(1);

    if (existingOrder.length > 0) {
      continue;
    }

    const [createdOrder] = await db
      .insert(ordersTable)
      .values({
        orderNumber: order.id,
        customerName: order.client,
        contactChannel: order.contactChannel,
        contactValue: order.contactValue,
        address: order.address,
        deliveryDate: order.date,
        notes: order.notes,
        total: order.amount.toFixed(2),
        status: order.status,
      })
      .returning({ id: ordersTable.id });

    for (const item of order.items) {
      const product = productsByEnglishName.get(item.productName);

      if (!product) {
        throw new Error(`Bootstrap product not found for order item: ${item.productName}`);
      }

      const [existingOrderItem] = await db
        .select({ id: orderItemsTable.id })
        .from(orderItemsTable)
        .where(and(eq(orderItemsTable.orderId, createdOrder.id), eq(orderItemsTable.productId, product.id)))
        .limit(1);

      if (existingOrderItem) {
        continue;
      }

      await db.insert(orderItemsTable).values({
        orderId: createdOrder.id,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
      });
    }
  }
}

async function runBootstrap() {
  try {
    await bootstrapAdminUser();
    await bootstrapProducts();
    await bootstrapOrders();
  } catch (error) {
    bootstrapPromise = null;

    if (error instanceof Error) {
      throw new Error(`Bakery bootstrap failed: ${error.message}`);
    }

    throw new Error("Bakery bootstrap failed for an unknown reason.");
  }
}

export async function ensureBakeryBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap();
  }

  await bootstrapPromise;
}

export function getBootstrapCredentials() {
  return {
    email: bootstrapAdminEmail,
    password: bootstrapAdminPassword,
  };
}
