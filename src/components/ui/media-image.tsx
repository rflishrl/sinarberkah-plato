import type { ComponentProps } from "react";

import { type MediaVariant, resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

export interface MediaImageProps
  extends Omit<
    ComponentProps<"img">,
    "src" | "loading" | "decoding" | "fetchPriority"
  > {
  src: string | null | undefined;
  thumbSrc?: string | null | undefined;
  variant?: MediaVariant;
  priority?: "high" | "low";
  fill?: boolean;
  fallback?: string;
  alt: string;
}

/**
 * Komponen gambar standar (`<img>`) dengan validasi host terpusat, pemilihan varian
 * R2 `thumb` vs `full`, decoding asinkron, dan prioritas pemuatan eksplisit.
 */
export function MediaImage({
  src,
  thumbSrc,
  variant = "full",
  priority,
  fill = false,
  fallback,
  alt,
  className,
  onError,
  ...props
}: MediaImageProps) {
  const resolvedSrc = resolveMediaUrl(src, {
    thumbUrl: thumbSrc,
    variant,
    fallback,
  });

  if (!resolvedSrc) return null;

  const handleError: ComponentProps<"img">["onError"] = (event) => {
    onError?.(event);
    if (fallback && event.currentTarget.dataset.fallbackApplied !== "true") {
      event.currentTarget.dataset.fallbackApplied = "true";
      event.currentTarget.src = fallback;
    }
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={priority === "high" ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority}
      onError={fallback ? handleError : onError}
      className={cn(fill && "absolute inset-0 size-full", className)}
      {...props}
    />
  );
}
