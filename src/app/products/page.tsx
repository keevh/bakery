import { getMenuProducts } from "@/modules/catalog/application/get-menu-products";
import { CatalogPage } from "@/modules/storefront/presentation/catalog/catalog-page";

export const dynamic = "force-dynamic";

export default async function ProductsRoute() {
  const products = await getMenuProducts();

  return <CatalogPage products={products} />;
}
