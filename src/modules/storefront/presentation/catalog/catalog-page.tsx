"use client";

import { useMemo, useState } from "react";

import type { Product, ProductCategory } from "@/modules/catalog/domain/product";
import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { Reveal } from "../motion";
import { ProductCard } from "../product-card";
import { Sticker } from "../ui";

type CategoryFilter = "all" | ProductCategory;

export function CatalogPage({ products }: { products: Product[] }) {
  const { lang, addToCart } = useStorefrontStore();
  const copy = storefrontCopy[lang];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: copy.filterAll },
    { key: "amasijo", label: copy.badgeAmasijo },
    { key: "hojaldre", label: copy.badgeHojaldre },
    { key: "dulce", label: copy.badgeDulce },
    { key: "galleteria", label: copy.badgeGalleteria },
  ];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch =
        !term ||
        product.name.es.toLowerCase().includes(term) ||
        product.name.en.toLowerCase().includes(term) ||
        product.description.es.toLowerCase().includes(term) ||
        product.description.en.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.shopTitle}</h1>
              <p className="text-sm font-bold uppercase text-[#3C2317]/60">{copy.shopSubtitle}</p>
            </div>
            <div className="group relative inline-flex cursor-help">
              <Sticker text={copy.shopSticker} color="bg-[#8B5CF6]" />
              <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border-2 border-[#3C2317]/10 bg-white px-4 py-3 text-left text-xs font-medium text-[#3C2317] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                <i className="ph ph-clock mr-1 text-[#8B5CF6]" /> {copy.shopStickerTooltip}
              </span>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4">
            <div className="relative max-w-md">
              <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#3C2317]/40" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-full border-2 border-[#3C2317]/10 bg-white py-3 pl-11 pr-4 text-sm font-bold text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={`rounded-full border-2 px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
                    category === item.key
                      ? "border-[#3C2317] bg-[#3C2317] text-white"
                      : "border-[#3C2317]/10 bg-white text-[#3C2317] hover:border-[#3C2317]/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index, 7) * 0.05}>
                  <ProductCard product={product} lang={lang} copy={copy} onAdd={addToCart} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-[#3C2317]/20 bg-white py-20 text-center">
              <i className="ph ph-bread mb-3 text-5xl text-[#3C2317]/30" />
              <p className="font-bold uppercase text-[#3C2317]/50">{copy.catalogEmpty}</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
