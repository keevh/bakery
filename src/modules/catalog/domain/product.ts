export type Language = "es" | "en";

export type LocalizedText = {
  es: string;
  en: string;
};

export type ProductCategory = "sourdough" | "brioche";

export type Product = {
  id: number;
  slug: string;
  category: ProductCategory;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  minOrder: number;
  image: string;
  isActive: boolean;
};
