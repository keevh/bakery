import { DbProductRepository } from "@/modules/catalog/infrastructure/db-product-repository";

import type { CreatePublicOrderCommand, CreatePublicOrderResult, PublicOrderContactChannel } from "../domain/public-order";
import { PublicOrderValidationError } from "../domain/public-order";
import { DbPublicOrderRepository } from "../infrastructure/db-public-order-repository";

const productRepository = new DbProductRepository();
const publicOrderRepository = new DbPublicOrderRepository();

const allowedContactChannels = new Set<PublicOrderContactChannel>(["email", "phone", "whatsapp"]);
const minimumLeadTimeInDays = 2;

function roundCurrency(amount: number) {
  return Math.round(amount * 100) / 100;
}

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new PublicOrderValidationError("Delivery date is invalid.");
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));

  if (Number.isNaN(date.getTime())) {
    throw new PublicOrderValidationError("Delivery date is invalid.");
  }

  if (date.toISOString().slice(0, 10) !== value) {
    throw new PublicOrderValidationError("Delivery date is invalid.");
  }

  return date;
}

function getMinimumDeliveryDate() {
  const minimumDate = new Date();
  minimumDate.setUTCHours(0, 0, 0, 0);
  minimumDate.setUTCDate(minimumDate.getUTCDate() + minimumLeadTimeInDays);
  return minimumDate;
}

function ensureObject(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new PublicOrderValidationError("Order payload is invalid.");
  }

  return payload as Record<string, unknown>;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new PublicOrderValidationError("Order must include at least one product.");
  }

  const aggregated = new Map<number, number>();

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new PublicOrderValidationError("Order items are invalid.");
    }

    const record = item as Record<string, unknown>;
    const productId = Number(record.productId);
    const quantity = Number(record.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new PublicOrderValidationError("Product id is invalid.");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new PublicOrderValidationError("Quantity must be a positive integer.");
    }

    aggregated.set(productId, (aggregated.get(productId) ?? 0) + quantity);
  }

  return Array.from(aggregated.entries()).map(([productId, quantity]) => ({ productId, quantity }));
}

export function parseCreatePublicOrderPayload(payload: unknown): CreatePublicOrderCommand {
  const record = ensureObject(payload);
  const customerName = normalizeString(record.customerName);
  const contactChannel = normalizeString(record.contactChannel) as PublicOrderContactChannel;
  const contactValue = normalizeString(record.contactValue);
  const deliveryDate = normalizeString(record.deliveryDate);
  const notes = normalizeString(record.notes) || null;
  const items = normalizeItems(record.items);

  if (!customerName) {
    throw new PublicOrderValidationError("Customer name is required.");
  }

  if (!allowedContactChannels.has(contactChannel)) {
    throw new PublicOrderValidationError("Contact channel is invalid.");
  }

  if (!contactValue) {
    throw new PublicOrderValidationError("Contact value is required.");
  }

  if (!deliveryDate) {
    throw new PublicOrderValidationError("Delivery date is required.");
  }

  return {
    customerName,
    contactChannel,
    contactValue,
    deliveryDate,
    notes,
    items,
  };
}

export async function createPublicOrder(command: CreatePublicOrderCommand): Promise<CreatePublicOrderResult> {
  const requestedDeliveryDate = parseDateOnly(command.deliveryDate);

  if (requestedDeliveryDate.getTime() < getMinimumDeliveryDate().getTime()) {
    throw new PublicOrderValidationError("Delivery date must be at least 48 hours from now.");
  }

  const products = await productRepository.listByIds(command.items.map((item) => item.productId));
  const productsById = new Map(products.map((product) => [product.id, product]));

  if (products.length !== command.items.length) {
    throw new PublicOrderValidationError("One or more selected products no longer exist.");
  }

  const normalizedItems = command.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new PublicOrderValidationError("One or more selected products no longer exist.");
    }

    if (!product.isActive) {
      throw new PublicOrderValidationError(`${product.name.en} is no longer available.`);
    }

    if (item.quantity < product.minOrder) {
      throw new PublicOrderValidationError(`${product.name.en} requires a minimum order of ${product.minOrder}.`);
    }

    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
    };
  });

  const total = roundCurrency(
    normalizedItems.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0),
  );

  const { orderNumber } = await publicOrderRepository.create({
    customerName: command.customerName,
    contactChannel: command.contactChannel,
    contactValue: command.contactValue,
    deliveryDate: command.deliveryDate,
    notes: command.notes,
    total,
    items: normalizedItems,
  });

  return {
    orderNumber,
    total,
    status: "pending",
  };
}
