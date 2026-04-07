import type { ProductCategory } from "@/modules/catalog/domain/product";
import { DbProductRepository } from "@/modules/catalog/infrastructure/db-product-repository";
import { ensureBakeryBootstrap } from "@/modules/bootstrap/application/ensure-bakery-bootstrap";

const productRepository = new DbProductRepository();

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseProductPayload(formData: FormData) {
  const slugInput = String(formData.get("slug") ?? "");
  const slug = normalizeSlug(slugInput);
  const category = String(formData.get("category") ?? "sourdough") as ProductCategory;
  const price = Number(formData.get("price") ?? 0);
  const minOrder = Number(formData.get("minOrder") ?? 0);
  const image = String(formData.get("image") ?? "").trim();
  const nameEs = String(formData.get("nameEs") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const descriptionEs = String(formData.get("descriptionEs") ?? "").trim();
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim();

  if (!slug || !image || !nameEs || !nameEn || !descriptionEs || !descriptionEn) {
    throw new Error("All product fields are required.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than zero.");
  }

  if (!Number.isInteger(minOrder) || minOrder <= 0) {
    throw new Error("Minimum order must be a positive integer.");
  }

  return {
    slug,
    category,
    name: {
      es: nameEs,
      en: nameEn,
    },
    description: {
      es: descriptionEs,
      en: descriptionEn,
    },
    price,
    minOrder,
    image,
    isActive: formData.get("isActive") === "on",
  };
}

export async function createAdminProduct(formData: FormData) {
  await ensureBakeryBootstrap();
  return productRepository.create(parseProductPayload(formData));
}

export async function updateAdminProduct(formData: FormData) {
  await ensureBakeryBootstrap();

  const id = Number(formData.get("id") ?? 0);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id.");
  }

  return productRepository.update(id, parseProductPayload(formData));
}

export async function toggleAdminProductAvailability(formData: FormData) {
  await ensureBakeryBootstrap();

  const id = Number(formData.get("id") ?? 0);
  const nextValue = String(formData.get("nextIsActive") ?? "false") === "true";

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id.");
  }

  return productRepository.toggleAvailability(id, nextValue);
}
