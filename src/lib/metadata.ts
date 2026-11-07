import { siteConfig } from "@/data/site";

interface PageHeadInput {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width: number; height: number; alt?: string };
  noIndex?: boolean;
}

const defaultImage = {
  url: "/images/hero-1.png",
  width: 1148,
  height: 770,
  alt: "Pekerja bengkel Sinar Berkah memotong plat besi",
};

/** Mengubah path lokal menjadi URL absolut. URL yang sudah absolut dibiarkan. */
export function absoluteUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return new URL(src, siteConfig.url).toString();
}

/**
 * Membentuk metadata head (title, description, canonical, Open Graph, Twitter)
 * untuk fungsi `head()` pada route TanStack Router.
 */
export function buildHeadMeta({
  title,
  description,
  path,
  image = defaultImage,
  noIndex = false,
}: PageHeadInput) {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`;
  const canonicalUrl = `${siteConfig.url}${path === "/" ? "" : path}`;
  const imageUrl = absoluteUrl(image.url);

  return {
    meta: [
      { title: pageTitle },
      { name: "description", content: description },
      ...(noIndex ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:type", content: "website" },
      { property: "og:locale", content: siteConfig.locale },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: String(image.width) },
      { property: "og:image:height", content: String(image.height) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
