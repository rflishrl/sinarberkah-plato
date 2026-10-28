"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContentImage } from "@/components/ui/content-image";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types/api";

/** Jumlah salinan tambahan agar gerakan otomatis tidak menyisakan ruang kosong. */
const CLONE_COPIES = 3;

/** Kartu asli (bukan salinan untuk gerakan otomatis). */
function getCards(viewport: HTMLElement): HTMLElement[] {
  return Array.from(
    viewport.querySelectorAll<HTMLElement>("figure:not([data-clone])"),
  );
}

/**
 * Baris foto proyek.
 * - Mobile/tablet: digeser dengan jari (swipe), dilengkapi titik penanda.
 * - Desktop: bergeser otomatis dan berhenti saat disorot mouse (lihat .marquee di globals.css).
 *   Salinan foto (data-clone) hanya tampil saat gerakan otomatis aktif.
 */
export function PortfolioRow({ items }: { items: PortfolioItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(true);

  const marqueeItems = [
    ...items.map((item) => ({ item, isClone: false, key: item._id })),
    ...Array.from({ length: CLONE_COPIES }, (_, copy) =>
      items.map((item) => ({
        item,
        isClone: true,
        key: `${item._id}-clone-${copy}`,
      })),
    ).flat(),
  ];

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    setCanScroll(viewport.scrollWidth > viewport.clientWidth + 2);

    const cards = getCards(viewport);
    if (cards.length === 0) return;

    // Di ujung kanan, kartu terakhir tidak bisa sejajar dengan tepi kiri.
    const atEnd =
      viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    if (atEnd) {
      setActiveIndex(cards.length - 1);
      return;
    }

    const viewportLeft = viewport.getBoundingClientRect().left;
    const inset = parseFloat(getComputedStyle(viewport).scrollPaddingLeft) || 0;
    let closest = 0;
    let smallestGap = Infinity;
    cards.forEach((card, i) => {
      const gap = Math.abs(
        card.getBoundingClientRect().left - viewportLeft - inset,
      );
      if (gap < smallestGap) {
        smallestGap = gap;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  // Hitung ulang saat ukuran berubah (rotasi layar, ubah ukuran jendela).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(handleScroll);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [handleScroll]);

  const scrollToCard = (index: number) => {
    const viewport = viewportRef.current;
    const card = viewport ? getCards(viewport)[index] : undefined;
    if (!viewport || !card) return;

    const inset = parseFloat(getComputedStyle(viewport).scrollPaddingLeft) || 0;
    const delta =
      card.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left -
      inset;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    viewport.scrollBy({
      left: delta,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="min-w-0">
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        role="region"
        aria-label="Contoh proyek yang pernah dikerjakan"
        tabIndex={0}
        className="marquee-viewport snap-x snap-mandatory scroll-pl-5 [scrollbar-width:none] overflow-x-auto px-5 pb-4 sm:scroll-pl-8 sm:px-8 lg:pr-0 lg:pl-6 [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="marquee-track flex w-max"
          style={
            {
              "--marquee-duration": `${Math.max(items.length, 1) * 12}s`,
            } as React.CSSProperties
          }
        >
          {marqueeItems.map(({ item, isClone, key }) => (
            <figure
              key={key}
              data-clone={isClone ? "" : undefined}
              aria-hidden={isClone ? true : undefined}
              className="relative mr-4 aspect-[235/250] w-[70vw] max-w-60 shrink-0 snap-start bg-line sm:w-60"
            >
              <ContentImage
                src={item.image.image_url}
                alt={isClone ? "" : item.title}
                sizes="(min-width: 640px) 240px, 70vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>

      {items.length > 1 && canScroll && (
        <div className="marquee-dots mt-2 flex items-center justify-center">
          {items.map((item, i) => (
            <button
              key={item._id}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`Tampilkan proyek ${i + 1}`}
              aria-current={i === activeIndex}
              className="group inline-flex size-6 cursor-pointer items-center justify-center"
            >
              <span
                className={cn(
                  "size-2.5 rounded-full transition-colors duration-200 motion-reduce:transition-none",
                  i === activeIndex
                    ? "bg-brand"
                    : "bg-line group-hover:bg-muted/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
