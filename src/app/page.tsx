import { getCatalogProducts } from "@/modules/catalog/application/get-catalog-products";
import { StorefrontPage } from "@/modules/storefront/presentation/storefront-page";

export default async function HomePage() {
  const products = await getCatalogProducts();

  return <StorefrontPage products={products} initialView="home" />;
}
