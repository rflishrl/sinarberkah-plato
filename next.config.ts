import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/*
 * Content Security Policy. Next.js menyisipkan skrip inline untuk hidrasi, dan halaman
 * ini statis (ISR) sehingga nonce tidak bisa dipakai; karena itu `'unsafe-inline'` tetap ada.
 * Yang dikunci: asal skrip/fetch, objek, form, base URL, pembingkaian, dan iframe
 * (hanya Google Maps). Gambar boleh dari host https mana pun karena data lama
 * di backend bisa memakai host di luar Vercel Blob.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Foto yang diunggah lewat backend disimpan di Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Rute lama: `/cart` dan `/produk` kini menjadi `/products`.
      { source: "/cart", destination: "/products", permanent: true },
      { source: "/produk", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
