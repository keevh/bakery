import { NextResponse } from "next/server";

import { getCatalogProducts } from "@/modules/catalog/application/get-catalog-products";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getCatalogProducts();
  return NextResponse.json({ products });
}
