import Image from "next/image";

import { isOptimizableImage } from "@/lib/utils";

interface ContentImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}

/**
 * Gambar yang mengisi parent (parent harus `relative` dan punya ukuran).
 *
 * Gambar dari /public dan dari Vercel Blob (foto yang diunggah lewat backend) dioptimasi
 * Next.js. Gambar dari host lain dimuat apa adanya (`unoptimized`); daftarkan host-nya
 * di `images.remotePatterns` pada next.config.ts lalu tambahkan ke `isOptimizableImage`.
 */
export function ContentImage({
  src,
  alt,
  sizes,
  className,
  preload,
}: ContentImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={!isOptimizableImage(src)}
      className={className}
    />
  );
}
