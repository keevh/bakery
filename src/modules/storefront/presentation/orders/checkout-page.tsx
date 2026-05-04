/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { storefrontCopy } from "@/modules/storefront/content/storefront-copy";
import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { CartSummary } from "../cart/cart-summary";
import { CheckoutForm } from "../cart/checkout-form";
import type { CheckoutFormState } from "../cart/cart-types";
import { formatPrice } from "../format-price";
import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { useMounted } from "../use-mounted";

function getMinDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().split("T")[0] ?? "";
}

function createInitialForm(): CheckoutFormState {
  return {
    customerName: "",
    contactChannel: "cell",
    contactValue: "",
    address: "",
    deliveryDate: getMinDeliveryDate(),
    notes: "",
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cellPattern = /^[+]?[\d\s-]{7,}$/;

function validateForm(form: CheckoutFormState, copy: (typeof storefrontCopy)[keyof typeof storefrontCopy]): string | null {
  if (!form.customerName.trim()) return copy.cartNameRequired;

  if (form.contactChannel === "email" && !emailPattern.test(form.contactValue.trim())) {
    return copy.cartContactInvalidEmail;
  }

  if (form.contactChannel === "cell" && !cellPattern.test(form.contactValue.trim())) {
    return copy.cartContactInvalidPhone;
  }

  if (!form.address.trim()) return copy.cartAddressRequired;

  return null;
}

export function CheckoutPage() {
  const router = useRouter();
  const { lang, cart, clearCart, openCart, getCartSubtotal, getCartDiscount, getCartTotal } = useStorefrontStore();
  const copy = storefrontCopy[lang];
  const mounted = useMounted();

  const [form, setForm] = useState<CheckoutFormState>(() => createInitialForm());
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field: keyof CheckoutFormState, value: string) {
    setError(null);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;

    const validationError = validateForm(form, copy);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({ productId: item.product.id, quantity: item.qty })),
        }),
      });

      const payload = (await response.json()) as { error?: string; orderNumber?: string };

      if (!response.ok || !payload.orderNumber) {
        setError(payload.error ?? copy.cartErrorFallback);
        return;
      }

      clearCart();
      setForm(createInitialForm());
      setSuccessOrderNumber(payload.orderNumber);
      router.refresh();
    } catch {
      setError(copy.cartErrorFallback);
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasItems = mounted && cart.length > 0;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-[#3C2317]">{copy.checkoutTitle}</h1>
          <p className="mb-10 text-sm font-bold uppercase text-[#3C2317]/60">{copy.checkoutSubtitle}</p>

          {successOrderNumber ? (
            <div className="mx-auto max-w-xl rounded-[2rem] border-2 border-[#9BE1E8] bg-[#ECFCFD] p-8 text-center text-[#3C2317]">
              <i className="ph ph-check-circle mb-3 text-6xl text-[#4ADE80]" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8B5CF6]">{copy.cartSuccessTitle}</p>
              <p className="mt-2 text-3xl font-black uppercase tracking-tight">{successOrderNumber}</p>
              <p className="mt-3 text-sm font-medium">
                {copy.cartSuccessMessage} <span className="font-black">{successOrderNumber}</span>.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full border-2 border-[#3C2317] bg-[#FFDC39] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#3C2317] shadow-[2px_2px_0px_0px_#3C2317] transition-transform hover:-translate-y-1"
              >
                {copy.cartSuccessAction}
              </Link>
            </div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center rounded-[2rem] border-2 border-dashed border-[#3C2317]/20 bg-white py-20 text-center">
              <i className="ph ph-shopping-bag mb-4 text-6xl text-[#3C2317]/30" />
              <p className="mb-8 font-bold uppercase text-[#3C2317]/50">{copy.cartEmpty}</p>
              <Link
                href="/products"
                className="rounded-full border-2 border-[#3C2317] bg-[#FFDC39] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#3C2317] shadow-[2px_2px_0px_0px_#3C2317] transition-transform hover:-translate-y-1"
              >
                {copy.featuredSeeAll}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row">
              <div className="w-full lg:w-3/5">
                <CheckoutForm form={form} copy={copy} minDeliveryDate={getMinDeliveryDate()} onFieldChange={handleFieldChange} />
              </div>

              <aside className="w-full lg:w-2/5">
                <div className="sticky top-6 rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-6">
                  <h2 className="mb-5 text-xl font-black uppercase tracking-tight text-[#3C2317]">{copy.cartSummaryTitle}</h2>
                  <div className="mb-5 space-y-3 border-b-2 border-[#3C2317]/10 pb-5">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name[lang]} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-grow">
                          <p className="text-sm font-black uppercase leading-tight text-[#3C2317]">{item.product.name[lang]}</p>
                          <p className="text-xs font-bold text-[#3C2317]/50">{copy.cartQty}: {item.qty}</p>
                        </div>
                        <span className="text-sm font-black text-[#3C2317]">{formatPrice(item.product.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-5">
                    <CartSummary subtotal={getCartSubtotal()} discount={getCartDiscount()} total={getCartTotal()} copy={copy} />
                  </div>
                  {error ? (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3C2317] p-4 font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#FFDC39] transition-colors hover:bg-[#FF9B71] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? copy.btnCheckoutLoading : copy.btnCheckout} <i className="ph ph-arrow-right text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={openCart}
                    className="mt-4 block w-full text-center text-sm font-bold uppercase text-[#3C2317]/60 hover:text-[#3C2317]"
                  >
                    {copy.checkoutBackToCart}
                  </button>
                </div>
              </aside>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
