import { ButtonLink } from "@/components/ui/button";
import { ContentImage } from "@/components/ui/content-image";
import { cn } from "@/lib/utils";

interface BannerSectionProps {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  /** Gambar latar dari /public. */
  image: string;
  tone?: "light" | "dark";
}

/** Banner lebar penuh dengan teks di kiri dan ilustrasi di kanan (Pengiriman, Promo). */
export function BannerSection({
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  image,
  tone = "light",
}: BannerSectionProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        isDark ? "bg-ink on-dark" : "bg-surface",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 sm:h-full"
      >
        <ContentImage
          src={image}
          alt=""
          sizes="100vw"
          className="object-cover object-right-bottom"
        />
      </div>

      <div className="container-page pt-14 pb-48 sm:py-20 lg:py-[4.5rem]">
        <p
          className={cn(
            "text-sm font-bold tracking-wider uppercase",
            isDark ? "text-surface" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
        <h2
          className={cn(
            "mt-3 max-w-xl font-heading text-3xl leading-tight font-bold text-balance sm:text-4xl lg:text-5xl",
            isDark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        <ButtonLink href={ctaHref} className="mt-8">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
