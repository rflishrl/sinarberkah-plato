import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

const routes = ["", "/portfolio", "/gallery", "/article", "/products"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
