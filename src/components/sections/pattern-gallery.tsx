import { PatternCarousel } from "@/components/sections/pattern-carousel";
import { ButtonLink } from "@/components/ui/button";
import { getGallery } from "@/lib/api";
import { buildPatternSlides } from "@/lib/patterns";

function PatternHeader() {
  return (
    <>
      <p className="text-sm font-bold text-brand">Galeri Pola</p>
      <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
        Pola Pola Yang Kami Miliki
      </h2>
      <p className="mt-2 max-w-xl font-heading font-medium text-muted">
        kami memiliki banyak pola yang sudah jadi atau bisa juga custom
      </p>
      <ButtonLink href="/gallery" className="mt-6">
        Lihat Semua
      </ButtonLink>
    </>
  );
}

/** Galeri pola di beranda. Polanya diambil dari API backend. */
export async function PatternGallery() {
  const slides = buildPatternSlides(await getGallery());

  return (
    <section id="patterns" className="py-16 lg:py-24">
      <div className="container-page flex flex-col items-center text-center">
        <PatternHeader />
        <PatternCarousel slides={slides} />
      </div>
    </section>
  );
}

/** Kerangka sementara selagi pola dimuat dari API. */
export function PatternGallerySkeleton() {
  return (
    <section id="patterns" className="py-16 lg:py-24">
      <div className="container-page flex flex-col items-center text-center">
        <PatternHeader />
        <div
          aria-hidden="true"
          className="mt-10 aspect-[1116/446] w-full max-w-[695px] animate-pulse bg-line"
        />
      </div>
    </section>
  );
}
