"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ContentImage } from "@/components/ui/content-image";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import type { PatternSlide } from "@/types/api";

const AUTOPLAY_INTERVAL_MS = 4000;

export function PatternCarousel({ slides }: { slides: PatternSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const total = slides.length;

  // Geser otomatis hanya di desktop (layar lebar dengan mouse) dan
  // tidak dijalankan jika pengguna meminta gerakan dikurangi.
  const isDesktop = useMediaQuery("(min-width: 1024px) and (hover: hover)");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const canAutoplay = isDesktop && !prefersReducedMotion && total > 1;
  const isPlaying = canAutoplay && !interacting;

  const scrollToSlide = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: target * track.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || track.clientWidth === 0 || document.hidden) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      track.scrollTo({
        left: ((current + 1) % total) * track.clientWidth,
        behavior: "smooth",
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, total]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri pola"
      className="mt-10 w-full"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onFocus={() => setInteracting(true)}
        onBlur={() => setInteracting(false)}
        tabIndex={0}
        aria-live={isPlaying ? "off" : "polite"}
        className="mx-auto flex w-full max-w-[695px] snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${total}`}
            className="w-full shrink-0 snap-center"
          >
            {slide.kind === "strip" ? (
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1116}
                height={446}
                sizes="(min-width: 768px) 695px, 100vw"
                className="h-auto w-full"
              />
            ) : (
              <div className="relative mx-auto h-[220px] w-full bg-white sm:h-[360px] lg:h-[440px]">
                <ContentImage
                  src={slide.src}
                  alt={slide.alt}
                  sizes="(min-width: 768px) 695px, 100vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-3 flex w-full max-w-[695px] flex-wrap items-center justify-center">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollToSlide(i)}
            aria-label={`Tampilkan slide ${i + 1}`}
            aria-current={i === index}
            className="group inline-flex h-6 w-[21px] cursor-pointer items-center justify-center"
          >
            <span
              className={cn(
                "size-[9px] rounded-full transition-colors duration-200 motion-reduce:transition-none",
                i === index ? "bg-brand" : "bg-line group-hover:bg-muted/50",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
