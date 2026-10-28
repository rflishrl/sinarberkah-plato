import { Suspense } from "react";

import { About } from "@/components/sections/about";
import { BannerSection } from "@/components/sections/banner-section";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Materials } from "@/components/sections/materials";
import {
  PatternGallery,
  PatternGallerySkeleton,
} from "@/components/sections/pattern-gallery";
import {
  PortfolioPreview,
  PortfolioPreviewSkeleton,
} from "@/components/sections/portfolio-preview";
import { Services } from "@/components/sections/services";
import { heroSlides } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getPortfolio } from "@/lib/api";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 3600;

const PREVIEW_COUNT = 6;

/** Data portofolio dimuat terpisah, sehingga bagian lain beranda tidak menunggu API. */
async function PortfolioSection() {
  const portfolio = await getPortfolio();
  return <PortfolioPreview items={portfolio.slice(0, PREVIEW_COUNT)} />;
}

export default function HomePage() {
  const orderHref = whatsappLink(siteConfig.contact.whatsappOrder);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressCountry: "ID",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
        <PortfolioSection />
      </Suspense>
      <Suspense fallback={<PatternGallerySkeleton />}>
        <PatternGallery />
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
