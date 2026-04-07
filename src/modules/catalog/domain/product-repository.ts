import type { Product } from "./product";

export type SaveProductInput = Omit<Product, "id">;

export interface ProductRepository {
  listActive(): Promise<Product[]>;
  listAll(): Promise<Product[]>;
  listByIds(ids: number[]): Promise<Product[]>;
  create(input: SaveProductInput): Promise<Product>;
  update(id: number, input: SaveProductInput): Promise<Product>;
  toggleAvailability(id: number, isActive: boolean): Promise<Product>;
}
