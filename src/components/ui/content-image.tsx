import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface ContentImageProps extends Omit<
  ComponentProps<"img">,
  "src" | "alt" | "sizes"
> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
}

/**
 * Komponen gambar pengganti next/image yang mengisi elemen pembungkus (parent).
 * Parent harus memiliki posisi `relative` dan rasio/ukuran pasti.
 *
 * Menggunakan `fetchPriority="high"` dan `loading="eager"` jika `preload` aktif (mis. LCP hero slide),
 * serta `loading="lazy"` dan `decoding="async"` untuk gambar di bawah fold.
 */
export function ContentImage({
  src,
  alt,
  sizes,
  className,
  preload = false,
  ...props
}: ContentImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={preload ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={preload ? "high" : "auto"}
      className={cn("absolute inset-0 size-full", className)}
      {...props}
    />
  );
}
