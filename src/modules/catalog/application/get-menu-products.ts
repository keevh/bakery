import { DbProductRepository } from "../infrastructure/db-product-repository";

const repository = new DbProductRepository();

/**
 * Storefront menu: returns every product (including inactive ones) so the UI can show
 * unavailable items disabled instead of silently hiding them.
 */
export async function getMenuProducts() {
  return repository.listAll();
}
