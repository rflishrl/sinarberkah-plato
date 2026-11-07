import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/data/site";

const routes = ["", "/portfolio", "/gallery", "/products"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = routes
          .map((route) => {
            const loc = `${siteConfig.url}${route}`;
            const freq = route === "" ? "weekly" : "monthly";
            const priority = route === "" ? "1.0" : "0.7";
            return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      },
    },
  },
});
