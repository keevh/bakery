/* eslint-disable @next/next/no-img-element */
"use client";

import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { FadeIn, Reveal } from "../motion";
import { Sticker } from "../ui";

const content = {
  es: {
    badge: "Nuestra historia",
    title: "El arte del pan, lejos de casa",
    lead: "Una panadería colombiana en el corazón de Nueva York.",
    body1:
      "Empezamos amasando los recuerdos de las panaderías de barrio: el pandebono recién salido del horno, el olor del buñuelo en diciembre, la cascarita con el tinto de la mañana. Trajimos esas recetas a Nueva York para que un pedacito de Colombia se sienta como en casa.",
    body2:
      "Cada pieza se hornea a mano, con paciencia y el mismo cariño de siempre. No hacemos pan en serie: hacemos memoria, una hornada a la vez.",
    craftTitle: "Hecho a mano, todos los días",
    craftBody:
      "Trabajamos con tiempos de fermentación reales y producto fresco. Por eso los pedidos al por mayor se preparan con 48 horas de anticipación: así llega a tu mesa como debe ser.",
  },
  en: {
    badge: "Our story",
    title: "The craft of bread, far from home",
    lead: "A Colombian bakery in the heart of New York City.",
    body1:
      "We started by kneading the memories of neighborhood bakeries: pandebono fresh from the oven, the smell of buñuelos in December, cascarita with the morning coffee. We brought those recipes to New York so a little piece of Colombia feels like home.",
    body2:
      "Every piece is baked by hand, with patience and the same care as always. We don't mass-produce bread: we bake memories, one batch at a time.",
    craftTitle: "Handmade, every day",
    craftBody:
      "We work with real fermentation times and fresh product. That's why wholesale orders are prepared 48 hours in advance: so it reaches your table the way it should.",
  },
};

export function AboutPage() {
  const { lang } = useStorefrontStore();
  const copy = content[lang];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-center gap-12 md:flex-row">
            <FadeIn className="md:w-1/2">
              <p className="mb-3 inline-block rounded-full bg-[#9BE1E8] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]">
                {copy.badge}
              </p>
              <h1 className="mb-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-6xl">
                {copy.title}
              </h1>
              <p className="mb-6 text-lg font-bold uppercase text-[#3C2317]/70">
                {copy.lead} <Sticker text="🗽" color="bg-transparent" className="p-0 text-2xl shadow-none" />
              </p>
              <p className="mb-4 text-sm font-medium leading-relaxed text-[#3C2317]/80">{copy.body1}</p>
              <p className="text-sm font-medium leading-relaxed text-[#3C2317]/80">{copy.body2}</p>
            </FadeIn>
            <FadeIn delay={0.15} className="relative flex justify-center md:w-1/2">
              <div className="absolute h-72 w-72 rotate-6 rounded-[3rem] bg-[#FFDC39]" />
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
                alt="Pan artesanal"
                className="relative z-10 h-80 w-72 -rotate-3 rounded-[2rem] border-8 border-white object-cover shadow-lg"
              />
            </FadeIn>
          </div>

          <Reveal className="rounded-[2.5rem] bg-[#3C2317] p-8 md:p-12">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">{copy.craftTitle}</h2>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-[#FDFBF7]/80">{copy.craftBody}</p>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
