import type { NextConfig } from "next";

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
  async redirects() {
    return [
      // Rute lama: `/cart` dan `/produk` kini menjadi `/products`.
      { source: "/cart", destination: "/products", permanent: true },
      { source: "/produk", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
