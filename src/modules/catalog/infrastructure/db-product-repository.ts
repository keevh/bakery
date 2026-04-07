import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import type { Product } from "@/modules/catalog/domain/product";
import type { ProductRepository, SaveProductInput } from "@/modules/catalog/domain/product-repository";
import { db } from "@/modules/shared/infrastructure/db/client";
import { productsTable } from "@/modules/shared/infrastructure/db/schema";

function mapProduct(record: typeof productsTable.$inferSelect): Product {
  return {
    id: record.id,
    slug: record.slug,
    category: record.category,
    name: record.name,
    description: record.description,
    price: Number(record.price),
    minOrder: record.minOrder,
    image: record.image,
    isActive: record.isActive,
  };
}

export class DbProductRepository implements ProductRepository {
  async listActive() {
    const records = await db.select().from(productsTable).where(eq(productsTable.isActive, true)).orderBy(asc(productsTable.id));
    return records.map(mapProduct);
  }

  async listAll() {
    const records = await db.select().from(productsTable).orderBy(asc(productsTable.id));
    return records.map(mapProduct);
  }

  async listByIds(ids: number[]) {
    if (ids.length === 0) {
      return [];
    }

    const records = await db.select().from(productsTable).where(inArray(productsTable.id, ids)).orderBy(asc(productsTable.id));
    return records.map(mapProduct);
  }

  async create(input: SaveProductInput) {
    const [record] = await db
      .insert(productsTable)
      .values({
        slug: input.slug,
        category: input.category,
        name: input.name,
        description: input.description,
        price: input.price.toFixed(2),
        minOrder: input.minOrder,
        image: input.image,
        isActive: input.isActive,
      })
      .returning();

    return mapProduct(record);
  }

  async update(id: number, input: SaveProductInput) {
    const [record] = await db
      .update(productsTable)
      .set({
        slug: input.slug,
        category: input.category,
        name: input.name,
        description: input.description,
        price: input.price.toFixed(2),
        minOrder: input.minOrder,
        image: input.image,
        isActive: input.isActive,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    return mapProduct(record);
  }

  async toggleAvailability(id: number, isActive: boolean) {
    const [record] = await db
      .update(productsTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    return mapProduct(record);
  }
}
