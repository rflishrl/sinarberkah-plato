"use client";

import { useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import { ButtonLink } from "@/components/ui/button";
import { ContentImage } from "@/components/ui/content-image";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types/api";

const arrowBase =
  "inline-flex size-14 cursor-pointer items-center justify-center text-white transition-colors duration-200 motion-reduce:transition-none lg:size-[88px]";

/** Ukuran font besar dekoratif (128px di frame Figma 1280px). */
const ghostText =
  "pointer-events-none absolute hidden font-heading text-[clamp(5rem,10vw,8rem)] leading-[1.26] font-extrabold text-ghost select-none lg:block";

/**
 * Tata letak desktop mengikuti frame Figma 1280px: posisi horizontal dalam persen
 * (x / 1280) dan posisi vertikal dalam px, dihitung dari bawah navbar (86px).
 * Di bawah `lg` semuanya menumpuk ke bawah.
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];

  if (!slide) return null;

  const go = (step: number) =>
    setIndex((current) => (current + step + total) % total);
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan layanan"
      className="relative isolate -mt-16 overflow-x-clip bg-surface pt-16 lg:-mt-[86px] lg:pt-[86px]"
    >
      <div className="relative mx-auto w-full max-w-[1280px] pb-16 lg:h-[634px] lg:pb-0">
        {/* Panel putih di belakang foto */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-[46.17%] -z-10 hidden h-[506px] w-[calc(53.83%+50vw)] bg-white lg:block"
        />

        {/* Teks vertikal "SINAR BERKAH" */}
        <span
          aria-hidden="true"
          className={cn(
            ghostText,
            "bottom-[73px] left-[4.375%] -z-10 rotate-180 whitespace-nowrap uppercase [writing-mode:vertical-rl]",
          )}
        >
          Sinar Berkah
        </span>

        {/* Nomor slide */}
        <span
          aria-hidden="true"
          className={cn(ghostText, "top-[435px] left-[37.19%] -z-10")}
        >
          {number}
        </span>

        {/* Teks */}
        <div
          key={`text-${slide.id}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} dari ${total}`}
          aria-live="polite"
          className="relative z-10 animate-fade-in px-5 pt-12 sm:px-8 lg:absolute lg:top-[176px] lg:left-[22.11%] lg:w-[34.06%] lg:px-0 lg:pt-0"
        >
          <h1 className="font-heading text-4xl leading-[1.25] font-extrabold text-balance text-ink sm:text-5xl lg:text-[clamp(2.25rem,3.75vw,3rem)]">
            {slide.title}
          </h1>
          <p className="mt-[17px] text-base leading-[22px] font-medium text-muted lg:text-justify">
            {slide.description}
          </p>
          <ButtonLink href={slide.ctaHref} className="mt-8 lg:mt-12">
            {slide.ctaLabel}
          </ButtonLink>
        </div>

        {/* Foto + tombol panah */}
        <div className="relative mx-5 mt-12 mb-7 sm:mx-8 lg:absolute lg:top-[112px] lg:left-[50.78%] lg:m-0 lg:w-[44.84%]">
          <div
            key={`image-${slide.id}`}
            className="relative aspect-[574/385] w-full animate-fade-in overflow-hidden bg-line"
          >
            <ContentImage
              src={slide.image.src}
              alt={slide.image.alt}
              sizes="(min-width: 1280px) 574px, (min-width: 1024px) 45vw, 100vw"
              preload={index === 0}
              className="object-cover grayscale"
            />
          </div>

          <div className="absolute right-0 -bottom-7 flex gap-0.5 lg:top-[calc(100%-24px)] lg:bottom-auto">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Slide sebelumnya"
              className={cn(arrowBase, "bg-ink/35 hover:bg-ink/70")}
            >
              <MdArrowBack size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Slide berikutnya"
              className={cn(arrowBase, "bg-ink hover:bg-black")}
            >
              <MdArrowForward size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
