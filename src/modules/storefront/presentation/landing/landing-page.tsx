/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";

import type { Product, ProductCategory } from "@/modules/catalog/domain/product";
import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { ProductRail } from "../product-rail";
import { formatPrice } from "../format-price";
import { FadeIn, Reveal } from "../motion";
import { PillButton, Sticker } from "../ui";

type CategoryFilter = "all" | ProductCategory;

export function LandingPage({ products }: { products: Product[] }) {
  const { lang, addToCart } = useStorefrontStore();
  const copy = storefrontCopy[lang];
  const [category, setCategory] = useState<CategoryFilter>("all");
  const highlight = products[1] ?? products[0];

  const categories: { key: CategoryFilter; label: string; color: string }[] = [
    { key: "all", label: copy.filterAll, color: "bg-white" },
    { key: "amasijo", label: copy.badgeAmasijo, color: "bg-[#FFD1B3]" },
    { key: "hojaldre", label: copy.badgeHojaldre, color: "bg-[#9BE1E8]" },
    { key: "dulce", label: copy.badgeDulce, color: "bg-[#FFDC39]" },
    { key: "galleteria", label: copy.badgeGalleteria, color: "bg-[#C4B5FD]" },
  ];

  const categoryCount = (key: CategoryFilter) =>
    key === "all" ? products.length : products.filter((product) => product.category === key).length;

  const featured = (category === "all" ? products : products.filter((product) => product.category === category)).slice(0, 12);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="fade-in">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-20">
            <div className="relative flex flex-col items-center overflow-hidden rounded-[3rem] border-2 border-[#3C2317]/15 bg-white p-8 shadow-sm md:flex-row md:p-16">
              <FadeIn className="relative z-10 md:w-1/2">
                <h1 className="relative mb-6 text-6xl font-black uppercase leading-[0.85] tracking-tighter text-[#3C2317] md:text-8xl">
                  {copy.heroTitle1} <Sticker text={copy.heroSticker1} color="bg-[#4ADE80]" className="ml-2 -mt-2 -rotate-6 align-top text-xs md:text-sm" /> <br />
                  {copy.heroTitle2} <Sticker text={copy.heroSticker2} color="bg-[#FF9B71]" className="ml-3 rotate-3 align-middle text-xs md:text-sm" />
                </h1>
                <p className="mb-4 max-w-sm text-lg font-bold uppercase leading-snug text-[#3C2317] md:text-xl">
                  {copy.heroSubtitle} <Sticker text={copy.heroSticker3} color="bg-[#9BE1E8]" className="text-xs" />
                </p>
                <p className="mb-8 max-w-sm text-sm font-medium text-[#3C2317]/70">{copy.heroDesc}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <PillButton text={copy.btnOrder} href="/products" />
                  <Link href="/blog" className="flex items-center text-sm font-bold uppercase text-[#3C2317] hover:underline">
                    {copy.btnBlog} <i className="ph ph-caret-right ml-1" />
                  </Link>
                </div>
              </FadeIn>
              <div className="relative mt-12 flex justify-center md:mt-0 md:w-1/2">
                <div className="absolute z-0 h-80 w-64 rotate-12 rounded-[4rem] bg-[#FFDC39]" />
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600" alt="Stacked Bread" className="relative z-10 h-auto w-72 rotate-3 rounded-3xl border-4 border-white object-cover shadow-2xl" />
              </div>
            </div>
          </div>

          <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-12 sm:px-8 md:flex-row">
            <div className="relative flex justify-center md:w-1/2">
              <div className="absolute h-72 w-72 -rotate-6 rounded-[3rem] bg-[#9BE1E8]" />
              <img src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600" alt="Baguettes" className="relative z-10 h-80 w-64 -rotate-3 rounded-[2rem] border-8 border-white object-cover shadow-lg" />
              <div className="absolute -left-6 -top-6 z-20 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-2 border-[#3C2317] bg-[#FFDC39]">
                <span className="text-center text-[10px] font-black uppercase leading-tight text-[#3C2317]" dangerouslySetInnerHTML={{ __html: copy.featSticker }} />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-8 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-6xl">
                {copy.featTitle}
                <span className="whitespace-nowrap">
                  {" "}
                  <Sticker text="🍪" color="bg-transparent" className="-mt-4 m-0 p-0 align-middle text-4xl text-inherit shadow-none" />
                </span>
                <br /> {copy.featTitle2}
              </h2>
              {highlight ? (
                <div className="mb-6 flex max-w-md items-center gap-4 rounded-3xl border-2 border-[#3C2317]/10 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1">
                  <img src={highlight.image} alt={highlight.name[lang]} className="h-20 w-20 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black uppercase text-[#3C2317]">{highlight.name[lang]}</h4>
                    <p className="mb-1 text-xs font-bold uppercase text-[#3C2317]/50">{copy.featSubtitle}</p>
                    <p className="text-xl font-black text-[#FF9B71]">{formatPrice(highlight.price)}</p>
                  </div>
                </div>
              ) : null}
              <p className="max-w-sm text-sm font-bold text-[#3C2317]">{copy.featDesc}</p>
            </div>
          </Reveal>

          <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <h2 className="max-w-lg text-4xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-5xl">
                {copy.featuredTitle}
              </h2>
              <Link href="/products" className="flex items-center gap-1 text-sm font-bold uppercase text-[#8B5CF6] hover:underline">
                {copy.featuredSeeAll} <i className="ph ph-arrow-right" />
              </Link>
            </div>
            <div className="mb-8 flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={`flex items-center space-x-2 rounded-full border-2 px-4 py-2 transition-colors ${item.color} ${
                    category === item.key ? "border-[#3C2317]" : "border-transparent hover:border-[#3C2317]"
                  }`}
                >
                  <span className="text-sm font-bold uppercase text-[#3C2317]">{item.label}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C2317] text-xs font-bold text-white">
                    {categoryCount(item.key)}
                  </span>
                </button>
              ))}
            </div>
            {featured.length ? (
              <ProductRail products={featured} lang={lang} copy={copy} onAdd={addToCart} resetKey={category} />
            ) : (
              <p className="rounded-[2rem] border-2 border-dashed border-[#3C2317]/20 bg-white py-12 text-center font-bold uppercase text-[#3C2317]/40">
                {copy.catalogEmpty}
              </p>
            )}
          </Reveal>

          <Reveal className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[3rem] bg-[#3C2317] p-8 md:flex-row md:p-12">
              <div className="absolute left-8 top-8 flex flex-col gap-2 opacity-50">
                <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
                <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
                <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
              </div>
              <div className="relative z-10 flex justify-center md:w-1/2">
                <div className="w-full max-w-sm rotate-3 rounded-[2rem] bg-[#FDFBF7] p-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/HOMEMADE_BREAD_AND_SWEET_ROLLS_ARE_MADE_DAILY_BY_JIM_TILLMAN_OF_TILLMAN%27S_BAKERY._IT_IS_THE_ONLY_ONE_REMAINING_THAT..._-_NARA_-_558360.jpg" alt="Baking Art" className="h-64 w-full rounded-[1.5rem] object-cover" />
                </div>
              </div>
              <div className="z-10 md:w-1/2">
                <h2 className="mb-6 text-4xl font-black uppercase leading-[1.1] tracking-tighter text-white md:text-5xl">{copy.bentoTitle}</h2>
                <p className="mb-8 max-w-md text-sm font-medium text-[#FDFBF7]/80">{copy.bentoDesc}</p>
                <PillButton text={copy.btnLearn} href="/blog" />
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
