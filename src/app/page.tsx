import { getMenuProducts } from "@/modules/catalog/application/get-menu-products";
import { LandingPage } from "@/modules/storefront/presentation/landing/landing-page";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getMenuProducts();

  return <LandingPage products={products} />;
}
