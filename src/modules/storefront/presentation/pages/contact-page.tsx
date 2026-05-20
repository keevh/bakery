"use client";

import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { FadeIn, Reveal } from "../motion";

const content = {
  es: {
    badge: "Contacto",
    title: "Hablemos de pan",
    lead: "Pedidos al por mayor y eventos. Escríbenos y te respondemos el mismo día.",
    items: [
      { icon: "ph-map-pin", label: "Dirección", value: "123 Roosevelt Ave, Queens, NY 11372" },
      { icon: "ph-envelope-simple", label: "Correo", value: "hola@bakery.nyc", href: "mailto:hola@bakery.nyc" },
      { icon: "ph-whatsapp-logo", label: "WhatsApp", value: "+1 (917) 555-0112", href: "https://wa.me/19175550112" },
      { icon: "ph-clock", label: "Horario", value: "Lun a Sáb · 7:00 am – 7:00 pm" },
    ],
    note: "Recuerda: los pedidos se preparan con 48 horas de anticipación.",
  },
  en: {
    badge: "Contact",
    title: "Let's talk bread",
    lead: "Wholesale orders and events. Write to us and we reply the same day.",
    items: [
      { icon: "ph-map-pin", label: "Address", value: "123 Roosevelt Ave, Queens, NY 11372" },
      { icon: "ph-envelope-simple", label: "Email", value: "hola@bakery.nyc", href: "mailto:hola@bakery.nyc" },
      { icon: "ph-whatsapp-logo", label: "WhatsApp", value: "+1 (917) 555-0112", href: "https://wa.me/19175550112" },
      { icon: "ph-clock", label: "Hours", value: "Mon to Sat · 7:00 am – 7:00 pm" },
    ],
    note: "Reminder: orders are prepared 48 hours in advance.",
  },
};

export function ContactPage() {
  const { lang } = useStorefrontStore();
  const copy = content[lang];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <p className="mb-3 inline-block rounded-full bg-[#FF9B71] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
              {copy.badge}
            </p>
            <h1 className="mb-3 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[#3C2317] md:text-6xl">
              {copy.title}
            </h1>
            <p className="mb-10 max-w-xl text-sm font-medium text-[#3C2317]/70">{copy.lead}</p>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.items.map((item, index) => {
              const inner = (
                <div className="flex items-start gap-4 rounded-[2rem] border-2 border-[#3C2317]/10 bg-white p-6 transition-transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFDC39]">
                    <i className={`ph ${item.icon} text-2xl text-[#3C2317]`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3C2317]/40">{item.label}</p>
                    <p className="mt-1 font-bold text-[#3C2317]">{item.value}</p>
                  </div>
                </div>
              );

              return "href" in item && item.href ? (
                <Reveal key={item.label} delay={index * 0.06}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                </Reveal>
              ) : (
                <Reveal key={item.label} delay={index * 0.06}>
                  {inner}
                </Reveal>
              );
            })}
          </div>

          <p className="mt-8 rounded-[1.5rem] border-2 border-dashed border-[#3C2317]/20 bg-white px-5 py-4 text-sm font-bold uppercase text-[#3C2317]/60">
            <i className="ph ph-info mr-2" /> {copy.note}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
