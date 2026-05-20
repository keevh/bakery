"use client";

import Link from "next/link";

import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { useMounted } from "../use-mounted";

const content = {
  es: {
    error: "Error 404",
    title1: "Esta página",
    title2: "sigue en el horno",
    body: "Todavía no horneamos esta sección. Vuelve al inicio o explora nuestro menú mientras tanto.",
    home: "Volver al inicio",
    menu: "Ver menú",
  },
  en: {
    error: "Error 404",
    title1: "This page",
    title2: "is still in the oven",
    body: "We haven't baked this section yet. Go back home or explore our menu in the meantime.",
    home: "Back home",
    menu: "See menu",
  },
};

export function NotFoundView() {
  const { lang } = useStorefrontStore();
  const mounted = useMounted();
  const copy = content[mounted ? lang : "es"];

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7] text-[#3C2317]">
      <header className="border-b-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link href="/" className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">
            Bakery
          </Link>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center px-4 py-16">
        <section className="w-full max-w-xl rounded-[3rem] border-2 border-[#3C2317]/5 bg-white p-8 text-center shadow-sm md:p-14">
          <div className="mx-auto mb-6 flex h-28 w-28 rotate-6 items-center justify-center rounded-[2rem] border-2 border-[#3C2317] bg-[#FFDC39] text-6xl">
            🥖
          </div>
          <p className="mb-5 inline-block rounded-full bg-[#9BE1E8] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]">
            {copy.error}
          </p>
          <h1 className="mb-4 text-5xl font-black uppercase leading-[1.05] tracking-tighter text-[#3C2317] md:text-6xl">
            {copy.title1}
            <br />
            {copy.title2}
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-sm font-medium text-[#3C2317]/70">{copy.body}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border-2 border-[#3C2317] bg-[#3C2317] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-transform hover:-translate-y-1"
            >
              {copy.home}
            </Link>
            <Link
              href="/products"
              className="rounded-full border-2 border-[#3C2317] bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-[#3C2317] transition-transform hover:-translate-y-1"
            >
              {copy.menu}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
