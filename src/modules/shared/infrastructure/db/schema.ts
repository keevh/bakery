import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import type { LocalizedText } from "@/modules/catalog/domain/product";

export const orderStatusEnum = pgEnum("order_status", ["pending", "baking", "ready", "delivered", "cancelled"]);
export const productCategoryEnum = pgEnum("product_category", ["amasijo", "hojaldre", "dulce", "galleteria"]);

export const contactChannelEnum = pgEnum("contact_channel", ["email", "cell"]);

export const productsTable = pgTable(
  "products",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    slug: text("slug").notNull().unique(),
    category: productCategoryEnum("category").notNull().default("amasijo"),
    name: jsonb("name").$type<LocalizedText>().notNull(),
    description: jsonb("description").$type<LocalizedText>().notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    minOrder: integer("min_order").notNull(),
    image: text("image").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("products_active_id_idx").on(table.id).where(sql`${table.isActive} = true`),
    check("products_slug_not_blank_check", sql`length(trim(${table.slug})) > 0`),
    check("products_price_non_negative_check", sql`${table.price} >= 0`),
    check("products_min_order_positive_check", sql`${table.minOrder} > 0`),
  ],
);

export const ordersTable = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    customerName: text("customer_name").notNull(),
    contactChannel: contactChannelEnum("contact_channel").notNull(),
    contactValue: text("contact_value").notNull(),
    address: text("address").notNull(),
    deliveryDate: date("delivery_date").notNull(),
    notes: text("notes"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_delivery_date_created_at_idx").on(table.deliveryDate.desc(), table.createdAt.desc()),
    check("orders_order_number_not_blank_check", sql`length(trim(${table.orderNumber})) > 0`),
    check("orders_customer_name_not_blank_check", sql`length(trim(${table.customerName})) > 0`),
    check("orders_contact_value_not_blank_check", sql`length(trim(${table.contactValue})) > 0`),
    check("orders_address_not_blank_check", sql`length(trim(${table.address})) > 0`),
    check("orders_total_non_negative_check", sql`${table.total} >= 0`),
  ],
);

export const orderItemsTable = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => productsTable.id),
    productName: jsonb("product_name").$type<LocalizedText>().notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    unique("order_items_order_product_unique").on(table.orderId, table.productId),
    check("order_items_unit_price_non_negative_check", sql`${table.unitPrice} >= 0`),
    check("order_items_quantity_positive_check", sql`${table.quantity} > 0`),
  ],
);

export const adminUsersTable = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ordersRelations = relations(ordersTable, ({ many }) => ({
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));
