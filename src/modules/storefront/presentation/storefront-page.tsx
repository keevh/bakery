/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { Product } from "@/modules/catalog/domain/product";
import { mockOrders, storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

type View = "home" | "shop" | "admin";

type Props = {
  products: Product[];
  initialView: View;
};

type CheckoutFormState = {
  customerName: string;
  contactChannel: "email" | "phone" | "whatsapp";
  contactValue: string;
  deliveryDate: string;
  notes: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getMinDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().split("T")[0] ?? "";
}

function createInitialCheckoutForm(): CheckoutFormState {
  return {
    customerName: "",
    contactChannel: "whatsapp",
    contactValue: "",
    deliveryDate: getMinDeliveryDate(),
    notes: "",
  };
}

function PillButton({
  text,
  color = "bg-[#FFDC39]",
  className = "",
  onClick,
}: {
  text: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} rounded-full border-2 border-[#3C2317] px-6 py-2 font-bold uppercase tracking-wide text-[#3C2317] shadow-[2px_2px_0px_0px_#3C2317] transition-transform hover:-translate-y-1 ${className}`}
    >
      {text}
    </button>
  );
}

function Sticker({
  text,
  color = "bg-[#9BE1E8]",
  className = "",
}: {
  text: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-black uppercase text-white shadow-md ${color} ${className}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

function CategoryBadge({ name, count, color }: { name: string; count: string; color: string }) {
  return (
    <div className={`flex cursor-pointer items-center space-x-2 rounded-full border-2 border-transparent px-4 py-2 transition-colors hover:border-[#3C2317] ${color}`}>
      <span className="text-sm font-bold uppercase text-[#3C2317]">{name}</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C2317] text-xs font-bold text-white">{count}</span>
    </div>
  );
}

function ProductCard({ product, lang, onAdd }: { product: Product; lang: "es" | "en"; onAdd: (id: number) => void }) {
  return (
    <div className="flex flex-col items-center rounded-[2rem] border-2 border-[#3C2317]/5 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-2 hover:border-[#3C2317]/20">
      <div className="mb-4 h-40 w-full overflow-hidden rounded-[1.5rem] bg-stone-100">
        <img src={product.image} alt={product.name[lang]} className="h-full w-full object-cover" />
      </div>
      <h3 className="mb-1 text-lg font-black uppercase leading-tight text-[#3C2317]">{product.name[lang]}</h3>
      <p className="mb-3 px-2 text-xs font-medium text-[#3C2317]/60">{product.description[lang]}</p>
      <div className="mt-auto flex w-full items-center justify-between">
        <span className="text-xl font-black text-[#FF9B71]">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={() => onAdd(product.id)}
          className="rounded-full bg-[#3C2317] p-2 text-white transition-colors hover:bg-[#8B5CF6]"
        >
          <i className="ph ph-plus text-xl" />
        </button>
      </div>
    </div>
  );
}

export function StorefrontPage({ products, initialView }: Props) {
  const router = useRouter();
  const { lang, cart, isCartOpen, setLang, openCart, closeCart, addToCart, removeFromCart, clearCart, getCartTotal } = useStorefrontStore();
  const [currentView, setCurrentView] = useState<View>(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(() => createInitialCheckoutForm());
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccessOrderNumber, setCheckoutSuccessOrderNumber] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const copy = storefrontCopy[lang];

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeView = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    setCheckoutError(null);
    setCheckoutSuccessOrderNumber(null);
    addToCart(product);
    openCart();
  };

  const handleCheckoutFieldChange = <K extends keyof CheckoutFormState>(field: K, value: CheckoutFormState[K]) => {
    setCheckoutError(null);
    setCheckoutForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0) {
      return;
    }

    setIsSubmittingOrder(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...checkoutForm,
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.qty,
          })),
        }),
      });

      const payload = (await response.json()) as { error?: string; orderNumber?: string };

      if (!response.ok || !payload.orderNumber) {
        setCheckoutError(payload.error ?? copy.cartErrorFallback);
        return;
      }

      clearCart();
      setCheckoutForm(createInitialCheckoutForm());
      setCheckoutSuccessOrderNumber(payload.orderNumber);
      router.refresh();
    } catch {
      setCheckoutError(copy.cartErrorFallback);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const cartCountBadge =
    cart.length > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#3C2317] bg-[#FF9B71] text-[10px] font-bold text-white">
        {cart.length}
      </span>
    ) : null;

  const renderHome = () => (
    <div className="fade-in">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-20">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[3rem] border-2 border-[#3C2317]/5 bg-white p-8 shadow-sm md:flex-row md:p-16">
          <div className="relative z-10 md:w-1/2">
            <h1 className="relative mb-6 text-6xl font-black uppercase leading-[0.85] tracking-tighter text-[#3C2317] md:text-8xl">
              {copy.heroTitle1} <Sticker text={copy.heroSticker1} color="bg-[#4ADE80]" className="-ml-2 -mt-4 -rotate-6 align-top" /> <br />
              {copy.heroTitle2} <Sticker text={copy.heroSticker2} color="bg-[#FF9B71]" className="-ml-4 rotate-3 align-middle" />
            </h1>
            <p className="mb-4 max-w-sm text-lg font-bold uppercase leading-snug text-[#3C2317] md:text-xl">
              {copy.heroSubtitle} <Sticker text={copy.heroSticker3} color="bg-[#9BE1E8]" className="text-xs" />
            </p>
            <p className="mb-8 max-w-sm text-sm font-medium text-[#3C2317]/70">{copy.heroDesc}</p>
            <div className="flex flex-wrap items-center gap-4">
              <PillButton text={copy.btnOrder} onClick={() => changeView("shop")} />
              <button type="button" className="flex items-center text-sm font-bold uppercase text-[#3C2317] hover:underline">
                {copy.btnBlog} <i className="ph ph-caret-right ml-1" />
              </button>
            </div>
          </div>
          <div className="relative mt-12 flex justify-center md:mt-0 md:w-1/2">
            <div className="absolute z-0 h-80 w-64 rotate-12 rounded-[4rem] bg-[#FFDC39]" />
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600" alt="Stacked Bread" className="relative z-10 h-auto w-72 rotate-3 rounded-3xl border-4 border-white object-cover shadow-2xl" />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-12 sm:px-8 md:flex-row">
        <div className="relative flex justify-center md:w-1/2">
          <div className="absolute h-72 w-72 -rotate-6 rounded-[3rem] bg-[#9BE1E8]" />
          <img src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600" alt="Baguettes" className="relative z-10 h-80 w-64 -rotate-3 rounded-[2rem] border-8 border-white object-cover shadow-lg" />
          <div className="absolute -left-6 -top-6 z-20 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-2 border-[#3C2317] bg-[#FFDC39]">
            <span className="text-center text-[10px] font-black uppercase leading-tight text-[#3C2317]" dangerouslySetInnerHTML={{ __html: copy.featSticker }} />
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="mb-8 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-6xl">
            {copy.featTitle} <Sticker text="🍪" color="bg-transparent" className="-mt-4 m-0 p-0 text-4xl align-middle text-4xl text-inherit shadow-none" /> <br /> {copy.featTitle2}
          </h2>
          <div className="mb-6 flex max-w-md items-center gap-4 rounded-3xl border-2 border-[#3C2317]/10 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1">
            <img src={products[1]?.image} alt="Buns" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <h4 className="font-black uppercase text-[#3C2317]">{products[1]?.name[lang]}</h4>
              <p className="mb-1 text-xs font-bold uppercase text-[#3C2317]/50">{copy.featSubtitle}</p>
              <p className="text-xl font-black text-[#FF9B71]">
                {products[1] ? formatPrice(products[1].price) : null} <span className="text-xs font-bold text-[#3C2317]/50">{copy.featUnits}</span>
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm font-bold text-[#3C2317]">{copy.featDesc}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-lg text-4xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-5xl">{copy.gridTitle}</h2>
          <div className="flex max-w-lg flex-wrap gap-3">
            <CategoryBadge name={copy.badgeSourdough} count="1" color="bg-[#FFD1B3]" />
            <CategoryBadge name={copy.badgeBrioche} count="1" color="bg-[#9BE1E8]" />
          </div>
        </div>
        <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              onAdd={(productId) => {
                const productToAdd = products.find((item) => item.id === productId);
                if (!productToAdd) return;
                handleAddToCart(productToAdd);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[3rem] bg-[#3C2317] p-8 md:flex-row md:p-12">
          <div className="absolute left-8 top-8 flex flex-col gap-2 opacity-50">
            <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
            <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
            <div className="h-2 w-2 rounded-full bg-[#FF9B71]" />
          </div>
          <div className="relative z-10 flex justify-center md:w-1/2">
            <div className="w-full max-w-sm rotate-3 rounded-[2rem] bg-[#FDFBF7] p-2">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRynZkDpKcSLHRX4PGJC1ynWwYL6YfDFS1VjA&s" alt="Baking Art" className="h-64 w-full rounded-[1.5rem] object-cover" />
            </div>
          </div>
          <div className="z-10 md:w-1/2">
            <h2 className="mb-6 text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-5xl">{copy.bentoTitle}</h2>
            <p className="mb-8 max-w-md text-sm font-medium text-[#FDFBF7]/80">{copy.bentoDesc}</p>
            <PillButton text={copy.btnLearn} onClick={() => changeView("shop")} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="fade-in px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.shopTitle}</h1>
            <p className="text-sm font-bold uppercase text-[#3C2317]/60">{copy.shopSubtitle}</p>
          </div>
          <div>
            <Sticker text={copy.shopSticker} color="bg-[#8B5CF6]" />
          </div>
        </div>
        <div className="grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              onAdd={(productId) => {
                const productToAdd = products.find((item) => item.id === productId);
                if (!productToAdd) return;
                handleAddToCart(productToAdd);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => {
    const getOrdersHTML = (statusKey: "Pending" | "Baking" | "Ready") => {
      const filtered = mockOrders.filter((order) => order.status === statusKey);
      if (filtered.length === 0) {
        return <p className="text-xs italic text-stone-400">{copy.adminNoOrders}</p>;
      }

      return filtered.map((order) => (
        <div key={order.id} className="mb-2 rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-bold text-[#3C2317]">{order.client}</p>
          <p className="text-xs text-stone-500">{order.date} • ${order.amount}</p>
        </div>
      ));
    };

    return (
      <div className="fade-in min-h-screen bg-stone-100 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.adminTitle}</h1>
            <button type="button" onClick={() => changeView("home")} className="rounded-full bg-[#3C2317] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-stone-800">{copy.btnExitAdmin}</button>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold uppercase text-[#3C2317]">{copy.adminSubtitle}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(["Pending", "Baking", "Ready"] as const).map((statusKey) => (
                <div key={statusKey} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                  <h3 className="mb-3 text-sm font-black uppercase text-stone-400">{copy.adminStatus[statusKey]}</h3>
                  {getOrdersHTML(statusKey)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFooter =
    currentView === "admin" ? null : (
      <footer className="mt-12 border-t-2 border-[#3C2317]/10 bg-white px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">Rollin.</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase text-[#3C2317]/60">
            <button type="button" className="hover:text-[#3C2317]">{copy.footerWholesale}</button>
            <button type="button" className="hover:text-[#3C2317]">{copy.footerContact}</button>
            <button type="button" onClick={() => router.push("/admin")} className="hover:text-[#8B5CF6]">{copy.footerAdmin}</button>
          </div>
        </div>
      </footer>
    );

  return (
    <>
      {currentView === "admin" ? null : (
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between overflow-hidden bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white">
            <span className="whitespace-nowrap">{copy.banner1}</span>
            <span className="hidden whitespace-nowrap sm:inline">{copy.banner2}</span>
            <span className="hidden whitespace-nowrap md:inline">{copy.banner1}</span>
          </div>

          <nav className="border-b-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-4 sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex cursor-pointer items-center" onClick={() => changeView("home")}>
                <span className="text-3xl font-black uppercase tracking-tighter text-[#3C2317]">Rollin.</span>
              </div>

              <div className="hidden items-center space-x-8 md:flex">
                <button type="button" onClick={() => changeView("shop")} className="text-sm font-bold uppercase text-[#3C2317] hover:text-[#8B5CF6]">{copy.navBakery}</button>
                <button type="button" className="text-sm font-bold uppercase text-[#3C2317] hover:text-[#8B5CF6]">{copy.navAbout}</button>
                <button type="button" className="text-sm font-bold uppercase text-[#3C2317] hover:text-[#8B5CF6]">{copy.navContact}</button>
                <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex items-center space-x-1 rounded-full bg-[#3C2317]/5 px-3 py-1 text-xs font-black uppercase text-[#3C2317] transition-colors hover:bg-[#3C2317]/10">
                  <i className="ph ph-translate" />
                  <span>{lang.toUpperCase()}</span>
                </button>
                <PillButton text={copy.btnStart} onClick={() => changeView("shop")} />
                <button type="button" onClick={openCart} className="relative rounded-full border-2 border-[#3C2317] bg-white p-2 transition-colors hover:bg-stone-100">
                  <i className="ph ph-shopping-bag text-xl" />
                  {cartCountBadge}
                </button>
              </div>

              <button type="button" className="p-2 text-[#3C2317] md:hidden" onClick={() => setIsMobileMenuOpen((value) => !value)}>
                {isMobileMenuOpen ? <i className="ph ph-x text-2xl" /> : <i className="ph ph-list text-2xl" />}
              </button>
            </div>
          </nav>

          {isMobileMenuOpen ? (
            <div className="space-y-4 border-b-2 border-[#3C2317]/10 bg-[#FDFBF7] px-4 py-4 md:hidden">
              <button type="button" onClick={() => changeView("home")} className="block w-full text-left font-black uppercase text-[#3C2317]">Home</button>
              <button type="button" onClick={() => changeView("shop")} className="block w-full text-left font-black uppercase text-[#3C2317]">{copy.navBakery}</button>
              <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex w-full items-center text-left font-bold uppercase text-[#3C2317]">
                <i className="ph ph-translate mr-2" /> {lang === "es" ? "English" : "Español"}
              </button>
            </div>
          ) : null}
        </div>
      )}

      <main className="min-h-screen">
        {currentView === "home" ? renderHome() : null}
        {currentView === "shop" ? renderShop() : null}
        {currentView === "admin" ? renderAdmin() : null}
      </main>

      {renderFooter}

      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-[#3C2317]/40 backdrop-blur-sm" onClick={closeCart} />
        <div className={`absolute right-0 top-0 flex h-full w-full max-w-md transform flex-col rounded-l-[2rem] border-l-4 border-[#3C2317] bg-[#FDFBF7] shadow-2xl transition-transform duration-500 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between rounded-tl-[1.8rem] border-b-2 border-[#3C2317]/10 bg-[#FFDC39] p-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.cartTitle}</h2>
            <button type="button" onClick={closeCart} className="rounded-full border-2 border-[#3C2317] bg-white p-1 text-[#3C2317] transition-transform hover:scale-110">
              <i className="ph ph-x text-lg" />
            </button>
          </div>
          <form onSubmit={handleCheckoutSubmit} className="flex h-full flex-col">
            <div className="flex-grow space-y-4 overflow-y-auto p-6">
              {checkoutSuccessOrderNumber ? (
                <div className="rounded-[2rem] border-2 border-[#9BE1E8] bg-[#ECFCFD] p-5 text-[#3C2317] shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8B5CF6]">{copy.cartSuccessTitle}</p>
                  <p className="mt-2 text-2xl font-black uppercase tracking-tight">{checkoutSuccessOrderNumber}</p>
                  <p className="mt-3 text-sm font-medium">
                    {copy.cartSuccessMessage} <span className="font-black">{checkoutSuccessOrderNumber}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutSuccessOrderNumber(null);
                      closeCart();
                    }}
                    className="mt-5 rounded-full border-2 border-[#3C2317] bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317] shadow-[3px_3px_0px_0px_#FFDC39]"
                  >
                    {copy.cartSuccessAction}
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="mt-20 flex flex-col items-center text-center text-[#3C2317]/30">
                  <i className="ph ph-shopping-bag mb-4 text-6xl" />
                  <p className="font-bold uppercase">{copy.cartEmpty}</p>
                </div>
              ) : (
                <>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 rounded-2xl border-2 border-[#3C2317]/10 bg-white p-3">
                    <img src={item.product.image} alt={item.product.name[lang]} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <h4 className="text-sm font-black uppercase leading-tight text-[#3C2317]">{item.product.name[lang]}</h4>
                      <p className="mb-1 text-xs font-bold text-[#3C2317]/50">{copy.cartQty}: {item.qty} {copy.cartUnits}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#FF9B71]">{formatPrice(item.product.price * item.qty)}</span>
                        <button type="button" onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-400 hover:text-red-600">
                          <i className="ph ph-trash text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="relative mt-6 overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
                  <div className="absolute left-0 top-0 h-full w-2 bg-[#FF9B71]" />
                  <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartNameLabel}</label>
                  <input
                    type="text"
                    value={checkoutForm.customerName}
                    onChange={(event) => handleCheckoutFieldChange("customerName", event.target.value)}
                    placeholder={copy.cartNamePlaceholder}
                    className="ml-2 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-bold text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
                    <div className="absolute left-0 top-0 h-full w-2 bg-[#FFDC39]" />
                    <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartContactChannelLabel}</label>
                    <select
                      value={checkoutForm.contactChannel}
                      onChange={(event) => handleCheckoutFieldChange("contactChannel", event.target.value as CheckoutFormState["contactChannel"])}
                      className="ml-2 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-bold uppercase text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
                    >
                      <option value="whatsapp">{copy.cartChannelWhatsapp}</option>
                      <option value="phone">{copy.cartChannelPhone}</option>
                      <option value="email">{copy.cartChannelEmail}</option>
                    </select>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
                    <div className="absolute left-0 top-0 h-full w-2 bg-[#9BE1E8]" />
                    <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartContactValueLabel}</label>
                    <input
                      type="text"
                      value={checkoutForm.contactValue}
                      onChange={(event) => handleCheckoutFieldChange("contactValue", event.target.value)}
                      placeholder={copy.cartContactValuePlaceholder}
                      className="ml-2 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-bold text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
                  <div className="absolute left-0 top-0 h-full w-2 bg-[#9BE1E8]" />
                  <label className="ml-2 mb-1 flex items-center text-sm font-black uppercase text-[#3C2317]">
                    <i className="ph ph-calendar mr-2 text-lg" /> {copy.cartDateLabel}
                  </label>
                  <p className="ml-2 mb-3 text-[10px] font-bold uppercase text-[#3C2317]/50">{copy.cartDateSub}</p>
                  <input
                    type="date"
                    min={getMinDeliveryDate()}
                    value={checkoutForm.deliveryDate}
                    onChange={(event) => handleCheckoutFieldChange("deliveryDate", event.target.value)}
                    className="ml-2 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-bold text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
                    required
                  />
                </div>

                <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
                  <div className="absolute left-0 top-0 h-full w-2 bg-[#8B5CF6]" />
                  <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartNotesLabel}</label>
                  <textarea
                    value={checkoutForm.notes}
                    onChange={(event) => handleCheckoutFieldChange("notes", event.target.value)}
                    placeholder={copy.cartNotesPlaceholder}
                    className="ml-2 min-h-24 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-medium text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
              </>
              )}
            </div>
            {cart.length > 0 && !checkoutSuccessOrderNumber ? (
              <div className="border-t-2 border-[#3C2317]/10 bg-white p-6">
                {checkoutError ? (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{checkoutError}</div>
                ) : null}
                <div className="mb-4 flex items-end justify-between">
                  <span className="text-sm font-bold uppercase text-[#3C2317]/60">{copy.cartTotal}</span>
                  <span className="text-3xl font-black leading-none text-[#3C2317]">{formatPrice(getCartTotal())}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="flex w-full items-center justify-center rounded-full bg-[#3C2317] p-4 font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-colors hover:bg-[#FF9B71] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingOrder ? copy.btnCheckoutLoading : copy.btnCheckout} <i className="ph ph-arrow-right ml-2 text-xl" />
                </button>
                <div className="mt-4 flex justify-center gap-2 opacity-40 grayscale">
                  <i className="ph ph-credit-card text-2xl" />
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}
