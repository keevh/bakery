"use client";

import Link from "next/link";

import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

const footerLinkClass = "text-sm font-bold uppercase tracking-wide text-[#3C2317]/60 transition-colors hover:text-[#3C2317]";

export function SiteFooter() {
  const { lang } = useStorefrontStore();
  const copy = storefrontCopy[lang];

  return (
    <footer className="mt-12 border-t-2 border-[#3C2317]/10 bg-white px-4 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <Link href="/" className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">
          Bakery
        </Link>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/wholesale" className={footerLinkClass}>
            {copy.footerWholesale}
          </Link>
          <Link href="/contact" className={footerLinkClass}>
            {copy.footerContact}
          </Link>
          <Link href="/admin" className={footerLinkClass}>
            {copy.footerAdmin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
