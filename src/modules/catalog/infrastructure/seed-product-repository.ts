import type { Product } from "@/modules/catalog/domain/product";
import type { ProductRepository, SaveProductInput } from "@/modules/catalog/domain/product-repository";

import { catalogSeed } from "./catalog.seed";

export class SeedProductRepository implements ProductRepository {
  async listActive() {
    return catalogSeed.filter((product) => product.isActive);
  }

  async listAll() {
    return catalogSeed;
  }

  async listByIds(ids: number[]) {
    return catalogSeed.filter((product) => ids.includes(product.id));
  }

  async create(input: SaveProductInput): Promise<Product> {
    void input;
    throw new Error("SeedProductRepository is read-only.");
  }

  async update(id: number, input: SaveProductInput): Promise<Product> {
    void id;
    void input;
    throw new Error("SeedProductRepository is read-only.");
  }

  async toggleAvailability(id: number, isActive: boolean): Promise<Product> {
    void id;
    void isActive;
    throw new Error("SeedProductRepository is read-only.");
  }
}
