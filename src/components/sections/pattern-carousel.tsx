import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

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
      <div className="relative mx-auto max-w-[695px]">
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToSlide((index - 1 + total) % total)}
              aria-label="Slide pola sebelumnya"
              className="absolute -left-12 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand hover:shadow-card lg:flex"
            >
              <MdChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide((index + 1) % total)}
              aria-label="Slide pola berikutnya"
              className="absolute -right-12 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand hover:shadow-card lg:flex"
            >
              <MdChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        <div
          ref={trackRef}
          onScroll={handleScroll}
          onFocus={() => setInteracting(true)}
          onBlur={() => setInteracting(false)}
          tabIndex={0}
          aria-live={isPlaying ? "off" : "polite"}
          className="flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
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
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={1116}
                  height={446}
                  loading="lazy"
                  decoding="async"
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
      </div>

      <div className="relative mx-auto mt-3 flex w-full max-w-[695px] flex-wrap items-center justify-center">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollToSlide(i)}
            aria-label={`Tampilkan slide ${i + 1}`}
            aria-current={i === index}
            className="group inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center p-2"
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
