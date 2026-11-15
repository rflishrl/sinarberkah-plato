import type { ComponentProps } from "react";

import { MediaImage } from "@/components/ui/media-image";
import type { MediaVariant } from "@/lib/media-url";

interface ContentImageProps
  extends Omit<
    ComponentProps<"img">,
    "src" | "alt" | "sizes" | "loading" | "decoding" | "fetchPriority"
  > {
  src: string;
  thumbSrc?: string;
  variant?: MediaVariant;
  alt: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
  priority?: "high" | "low";
  fallback?: string;
}

/**
 * Komponen gambar pembungkus yang mengisi elemen parent (`relative` + aspect ratio).
 * Mendelegasikan ke `MediaImage` untuk validasi host dan varian `thumb`/`full`.
 */
export function ContentImage({
  preload = false,
  priority,
  ...props
}: ContentImageProps) {
  return <MediaImage fill priority={preload ? "high" : priority} {...props} />;
}
