import { Await, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { About } from "@/components/sections/about";
import { BannerSection } from "@/components/sections/banner-section";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Materials } from "@/components/sections/materials";
import { PatternCarousel } from "@/components/sections/pattern-carousel";
import { PatternGallerySkeleton } from "@/components/sections/pattern-gallery";
import {
  PortfolioPreview,
  PortfolioPreviewSkeleton,
} from "@/components/sections/portfolio-preview";
import { Services } from "@/components/sections/services";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { heroSlides } from "@/data/content";
import { siteConfig } from "@/data/site";
import { absoluteUrl, buildHeadMeta } from "@/lib/metadata";
import { buildPatternSlides } from "@/lib/patterns";
import { getGalleryServerFn, getPortfolioServerFn } from "@/lib/server-fns";
import { whatsappLink } from "@/lib/whatsapp";

const PREVIEW_COUNT = 6;

export const Route = createFileRoute("/")({
  loader: () => {
    return {
      portfolioPromise: getPortfolioServerFn(),
      galleryPromise: getGalleryServerFn(),
    };
  },
  head: () =>
    buildHeadMeta({
      title: "",
      description: siteConfig.description,
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const { portfolioPromise, galleryPromise } = Route.useLoaderData();
  const orderHref = whatsappLink(siteConfig.contact.whatsappOrder);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneDisplay,
    image: absoluteUrl("/images/hero-1.png"),
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.location.latitude,
      longitude: siteConfig.location.longitude,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.streetAddress,
      addressLocality: siteConfig.location.locality,
      addressRegion: siteConfig.location.region,
      postalCode: siteConfig.location.postalCode,
      addressCountry: "ID",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero slides={heroSlides} />
      <About />
      <Services />
      <BannerSection
        eyebrow="Fasilitas kami"
        title="Pengiriman Seluruh Indonesia"
        ctaLabel="Pesan Sekarang"
        ctaHref={orderHref}
        image="/images/delivery-bg.png"
      />
      <Suspense fallback={<PortfolioPreviewSkeleton />}>
        <Await promise={portfolioPromise}>
          {(portfolio) => (
            <PortfolioPreview items={portfolio.slice(0, PREVIEW_COUNT)} />
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<PatternGallerySkeleton />}>
        <Await promise={galleryPromise}>
          {(gallery) => {
            const slides = buildPatternSlides(gallery);
            return (
              <section id="patterns" className="py-16 lg:py-24">
                <div className="container-page flex flex-col items-center text-center">
                  <p className="text-sm font-bold text-brand">Galeri Pola</p>
                  <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
                    Pola Pola Yang Kami Miliki
                  </h2>
                  <p className="mt-2 max-w-xl font-heading font-medium text-muted">
                    kami memiliki banyak pola yang sudah jadi atau bisa juga
                    custom
                  </p>
                  <ButtonLink href="/gallery" className="mt-6">
                    Lihat Semua
                  </ButtonLink>
                  <PatternCarousel slides={slides} />
                </div>
              </section>
            );
          }}
        </Await>
      </Suspense>
      <BannerSection
        tone="dark"
        eyebrow="Promo"
        title="Dapatkan Penawaran Khusus"
        ctaLabel="Pesan Sekarang"
        ctaHref={orderHref}
        image="/images/promo-bg.png"
      />
      <Materials />
      <Contact />
    </>
  );
}
