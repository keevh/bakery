"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { CartDrawer } from "../cart/cart-drawer";
import { useMounted } from "../use-mounted";
import { PillButton } from "../ui";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, getCartCount, openCart } = useStorefrontStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useMounted();
  const copy = storefrontCopy[lang];
  const cartCount = mounted ? getCartCount() : 0;

  const navLinks = [
    { href: "/products", label: copy.navBakery },
    { href: "/about", label: copy.navAbout },
    { href: "/contact", label: copy.navContact },
  ];

  const linkClass = (href: string) =>
    `text-sm font-bold uppercase transition-colors ${
      pathname === href ? "text-[#8B5CF6]" : "text-[#3C2317] hover:text-[#8B5CF6]"
    }`;

  return (
    <>
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between overflow-hidden bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white">
        <span className="whitespace-nowrap">{copy.banner1}</span>
        <span className="hidden whitespace-nowrap sm:inline">{copy.banner2}</span>
        <span className="hidden whitespace-nowrap md:inline">{copy.banner1}</span>
      </div>

      <nav className="border-b-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">
            Bakery
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="flex items-center space-x-1 rounded-full bg-[#3C2317]/5 px-3 py-1 text-xs font-black uppercase text-[#3C2317] transition-colors hover:bg-[#3C2317]/10"
            >
              <i className="ph ph-translate" />
              <span>{lang.toUpperCase()}</span>
            </button>
            <PillButton text={copy.btnStart} href="/products" />
            <button
              type="button"
              onClick={openCart}
              aria-label={copy.cartTitle}
              className="relative rounded-full border-2 border-[#3C2317] bg-white p-2 transition-colors hover:bg-stone-100"
            >
              <i className="ph ph-shopping-bag text-xl" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#3C2317] px-1.5 text-xs font-black text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={openCart}
              aria-label={copy.cartTitle}
              className="relative rounded-full border-2 border-[#3C2317] bg-white p-2"
            >
              <i className="ph ph-shopping-bag text-xl" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#3C2317] px-1.5 text-xs font-black text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
            <button type="button" className="p-2 text-[#3C2317]" onClick={() => setIsMobileMenuOpen((value) => !value)}>
              {isMobileMenuOpen ? <i className="ph ph-x text-2xl" /> : <i className="ph ph-list text-2xl" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="space-y-4 border-b-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-4 md:hidden">
          <Link href="/" className="block w-full text-left font-black uppercase text-[#3C2317]">
            {copy.navHome ?? "Inicio"}
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block w-full text-left font-black uppercase text-[#3C2317]">
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex w-full items-center text-left font-bold uppercase text-[#3C2317]"
          >
            <i className="ph ph-translate mr-2" /> {lang === "es" ? "English" : "Español"}
          </button>
        </div>
      ) : null}
    </div>
    <CartDrawer />
    </>
  );
}
