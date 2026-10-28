import { PortfolioRow } from "@/components/sections/portfolio-row";
import { ButtonLink } from "@/components/ui/button";
import type { PortfolioItem } from "@/types/api";

export function PortfolioPreview({ items }: { items: PortfolioItem[] }) {
  return (
    <section id="portfolio" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
        <div className="container-page lg:order-last lg:px-0 lg:pr-14">
          <p className="text-sm font-bold tracking-wider text-brand uppercase">
            Portofolio kami
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
            Project Yang Pernah Kami Kerjakan
          </h2>
          <p className="mt-4 text-sm text-muted">
            Sangat ideal untuk bermitra dengan kami karena sudah tidak diragukan
            lagi cara kami dalam menangani orderan dari anda semua
          </p>
          <ButtonLink href="/portfolio" className="mt-6">
            Lihat Semua
          </ButtonLink>
        </div>

        {items.length > 0 && <PortfolioRow items={items} />}
      </div>
    </section>
  );
}

/** Kerangka sementara selagi data portofolio dimuat. */
export function PortfolioPreviewSkeleton() {
  return (
    <section aria-hidden="true" className="py-16 lg:py-24">
      <div className="container-page flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="aspect-[235/250] w-[70%] shrink-0 animate-pulse bg-line sm:w-60"
          />
        ))}
      </div>
    </section>
  );
}
