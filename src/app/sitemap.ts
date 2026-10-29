import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

// `/article` belum dimasukkan: fitur artikel di backend belum ada, halamannya masih kosong.
const routes = ["", "/portfolio", "/gallery", "/products"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
