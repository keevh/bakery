"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import type { Language, Product } from "@/modules/catalog/domain/product";
import type { StoreCopy } from "@/modules/storefront/presentation/cart/cart-types";

import { ProductCard } from "./product-card";

type ProductRailProps = {
  products: Product[];
  lang: Language;
  copy: StoreCopy;
  onAdd: (product: Product) => void;
  /** Changing this value resets and briefly pauses the autoplay (e.g. on filter change). */
  resetKey?: string;
};

const SPEED_PX_PER_SEC = 36;

export function ProductRail({ products, lang, copy, onAdd, resetKey }: ProductRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [canLoop, setCanLoop] = useState(false);
  const interactTimer = useRef<number | null>(null);

  const pauseTemporarily = useCallback((ms = 2000) => {
    setInteracting(true);
    if (interactTimer.current) window.clearTimeout(interactTimer.current);
    interactTimer.current = window.setTimeout(() => setInteracting(false), ms);
  }, []);

  // Only loop/autoplay when the content actually overflows the track; otherwise a few
  // products would just render duplicated side by side.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const measure = () => {
      // When already duplicated, the real content is half the scroll width.
      const contentWidth = canLoop ? el.scrollWidth / 2 : el.scrollWidth;
      setCanLoop(contentWidth - el.clientWidth > 8);
    };

    const raf = requestAnimationFrame(measure);
    const observer = new ResizeObserver(() => requestAnimationFrame(measure));
    observer.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [resetKey, canLoop, products.length]);

  // Reset position + pause when the filtered set changes.
  useEffect(() => {
    if (railRef.current) railRef.current.scrollLeft = 0;
    // Intentional: briefly pause autoplay right after a filter change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    pauseTemporarily(1800);
  }, [resetKey, pauseTemporarily]);

  // Infinite autoplay: advance scrollLeft and wrap around the duplicated track.
  useEffect(() => {
    if (shouldReduceMotion || !canLoop) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const el = railRef.current;

      if (el && !hovered && !interacting) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          el.scrollLeft += SPEED_PX_PER_SEC * dt;
          if (el.scrollLeft >= half) el.scrollLeft -= half;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered, interacting, shouldReduceMotion, canLoop]);

  function scrollRail(direction: "left" | "right") {
    railRef.current?.scrollBy({ left: direction === "right" ? 320 : -320, behavior: "smooth" });
    pauseTemporarily();
  }

  // Duplicate only when looping so few products don't appear repeated.
  const track = canLoop ? [...products, ...products] : products;

  return (
    <div className="relative">
      {canLoop ? (
        <div className="mb-4 hidden justify-end gap-2 md:flex">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollRail("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#3C2317] bg-white text-[#3C2317] transition-transform hover:-translate-y-0.5"
          >
            <i className="ph ph-arrow-left text-lg" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollRail("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#3C2317] bg-white text-[#3C2317] transition-transform hover:-translate-y-0.5"
          >
            <i className="ph ph-arrow-right text-lg" />
          </button>
        </div>
      ) : null}
      <div
        ref={railRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={() => pauseTemporarily()}
        className="flex gap-5 overflow-x-auto pt-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {track.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            aria-hidden={index >= products.length}
            className="min-w-[240px] flex-[0_0_240px] sm:min-w-[260px] sm:flex-[0_0_260px]"
          >
            <ProductCard product={product} lang={lang} copy={copy} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </div>
  );
}
