import { DbProductRepository } from "../infrastructure/db-product-repository";

const repository = new DbProductRepository();

export async function getCatalogProducts() {
  return repository.listActive();
}
