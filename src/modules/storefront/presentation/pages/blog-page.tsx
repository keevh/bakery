/* eslint-disable @next/next/no-img-element */
"use client";

import { useStorefrontStore } from "@/modules/storefront/state/storefront-store";

import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import { FadeIn, Reveal } from "../motion";

const content = {
  es: {
    badge: "Blog Panadero",
    title: "Historias del horno",
    lead: "Recetas, oficio y recuerdos de la panadería colombiana, contados desde Nueva York.",
    soon: "Próximamente",
    posts: [
      {
        tag: "Tradición",
        title: "El secreto del pandebono perfecto",
        excerpt: "Almidón de yuca, queso fresco y el punto justo de horno: por qué este amasijo es el alma de toda panadería colombiana.",
        image: "https://recetas.encolombia.com/wp-content/uploads/2021/03/Pandebono.jpg",
      },
      {
        tag: "Oficio",
        title: "Por qué fermentamos 48 horas",
        excerpt: "El tiempo no se apura. Te contamos cómo la fermentación lenta transforma harina y paciencia en sabor.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
      },
      {
        tag: "Nuestra historia",
        title: "De Colombia a Nueva York",
        excerpt: "Cómo trajimos las recetas de barrio a la ciudad y por qué cada hornada todavía sabe a casa.",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/HOMEMADE_BREAD_AND_SWEET_ROLLS_ARE_MADE_DAILY_BY_JIM_TILLMAN_OF_TILLMAN%27S_BAKERY._IT_IS_THE_ONLY_ONE_REMAINING_THAT..._-_NARA_-_558360.jpg",
      },
    ],
  },
  en: {
    badge: "Baking Blog",
    title: "Stories from the oven",
    lead: "Recipes, craft and memories of Colombian baking, told from New York.",
    soon: "Coming soon",
    posts: [
      {
        tag: "Tradition",
        title: "The secret to a perfect pandebono",
        excerpt: "Cassava starch, fresh cheese and the right bake: why this dough is the soul of every Colombian bakery.",
        image: "https://recetas.encolombia.com/wp-content/uploads/2021/03/Pandebono.jpg",
      },
      {
        tag: "Craft",
        title: "Why we ferment for 48 hours",
        excerpt: "Time can't be rushed. Here's how slow fermentation turns flour and patience into flavor.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
      },
      {
        tag: "Our story",
        title: "From Colombia to New York",
        excerpt: "How we brought neighborhood recipes to the city, and why every batch still tastes like home.",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/HOMEMADE_BREAD_AND_SWEET_ROLLS_ARE_MADE_DAILY_BY_JIM_TILLMAN_OF_TILLMAN%27S_BAKERY._IT_IS_THE_ONLY_ONE_REMAINING_THAT..._-_NARA_-_558360.jpg",
      },
    ],
  },
};

export function BlogPage() {
  const { lang } = useStorefrontStore();
  const copy = content[lang];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="mb-10">
            <p className="mb-3 inline-block rounded-full bg-[#FFDC39] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]">
              {copy.badge}
            </p>
            <h1 className="mb-3 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-[#3C2317] md:text-6xl">
              {copy.title}
            </h1>
            <p className="max-w-xl text-sm font-medium text-[#3C2317]/70">{copy.lead}</p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.posts.map((post, index) => (
              <Reveal
                key={post.title}
                delay={index * 0.08}
                className="flex flex-col overflow-hidden rounded-[2rem] border-2 border-[#3C2317]/5 bg-white shadow-sm transition-transform hover:-translate-y-2"
              >
                <div className="h-44 w-full overflow-hidden bg-stone-100">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-grow flex-col p-5">
                  <span className="mb-2 inline-block w-fit rounded-full bg-[#9BE1E8] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#3C2317]">
                    {post.tag}
                  </span>
                  <h2 className="mb-2 text-xl font-black uppercase leading-tight tracking-tight text-[#3C2317]">{post.title}</h2>
                  <p className="mb-4 text-sm font-medium text-[#3C2317]/60">{post.excerpt}</p>
                  <span className="mt-auto text-xs font-black uppercase tracking-[0.2em] text-[#3C2317]/40">{copy.soon}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
