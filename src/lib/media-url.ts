const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export type MediaVariant = "thumb" | "full";

export interface ResolveMediaOptions {
  thumbUrl?: string | null | undefined;
  variant?: MediaVariant;
  fallback?: string;
  mediaDomain?: string;
}

function readConfiguredDomain(explicitDomain?: string): string | undefined {
  if (explicitDomain !== undefined) {
    return explicitDomain.trim() || undefined;
  }

  const metaEnv = (import.meta as { env?: Record<string, string | undefined> })
    .env;
  const fromImportMeta = metaEnv?.VITE_MEDIA_PUBLIC_DOMAIN?.trim();
  if (fromImportMeta) return fromImportMeta;

  if (typeof process !== "undefined") {
    const fromProcess = process.env.VITE_MEDIA_PUBLIC_DOMAIN?.trim();
    if (fromProcess) return fromProcess;
  }

  return undefined;
}

/**
 * Mengembalikan origin ternormalisasi dari `VITE_MEDIA_PUBLIC_DOMAIN`
 * (mis. `https://media-sb.example.com`), atau `null` jika belum diatur / tidak valid.
 */
export function getConfiguredMediaOrigin(
  explicitDomain?: string,
): string | null {
  const raw = readConfiguredDomain(explicitDomain);
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function isLegacyBlobUrl(url: URL): boolean {
  return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
}

function isLocalDevApiAsset(url: URL): boolean {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return false;
  }
  return (
    url.protocol === "http:" &&
    url.hostname === "localhost" &&
    url.port === "4000"
  );
}

/**
 * Daftar host yang diizinkan untuk media:
 * - Aset statis lokal diawali `/` tunggal (bukan `//`)
 * - Host persis yang dikonfigurasi lewat `VITE_MEDIA_PUBLIC_DOMAIN`
 * - Host Vercel Blob lama (`*.public.blob.vercel-storage.com`) selama masa transisi
 * - Backend lokal (`http://localhost:4000/...`) di luar produksi
 */
export function isAllowedMediaUrl(
  src: string,
  explicitDomain?: string,
): boolean {
  const value = src.trim();
  if (!value) return false;

  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  const configuredOrigin = getConfiguredMediaOrigin(explicitDomain);
  if (configuredOrigin && parsed.origin === configuredOrigin) {
    return true;
  }

  if (isLegacyBlobUrl(parsed)) {
    return true;
  }

  return isLocalDevApiAsset(parsed);
}

/**
 * Menurunkan URL thumbnail `-thumb.webp` secara deterministik hanya untuk host R2
 * yang dikonfigurasi pada `VITE_MEDIA_PUBLIC_DOMAIN`.
 */
export function deriveThumbUrl(src: string, explicitDomain?: string): string {
  const value = src.trim();
  if (!value || value.startsWith("/")) return value;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return value;
  }

  const configuredOrigin = getConfiguredMediaOrigin(explicitDomain);
  if (!configuredOrigin || parsed.origin !== configuredOrigin) {
    return value;
  }

  const lowerPath = parsed.pathname.toLowerCase();
  if (!lowerPath.endsWith(".webp") || lowerPath.endsWith("-thumb.webp")) {
    return value;
  }

  parsed.pathname = `${parsed.pathname.slice(0, -".webp".length)}-thumb.webp`;
  return parsed.toString();
}

/**
 * Menentukan URL media aman untuk `<img>` (`thumb` untuk kartu/grid/galeri,
 * `full` untuk hero/detail/og:image). Host lain ditolak ke `fallback`.
 */
export function resolveMediaUrl(
  src: string | null | undefined,
  options: ResolveMediaOptions = {},
): string {
  const { thumbUrl, variant = "full", fallback = "", mediaDomain } = options;

  if (variant === "thumb" && thumbUrl) {
    const trimmedThumb = thumbUrl.trim();
    if (isAllowedMediaUrl(trimmedThumb, mediaDomain)) {
      return trimmedThumb;
    }
  }

  if (!src) return fallback;
  const trimmed = src.trim();
  if (!isAllowedMediaUrl(trimmed, mediaDomain)) {
    return fallback;
  }

  if (variant === "thumb") {
    return deriveThumbUrl(trimmed, mediaDomain);
  }

  return trimmed;
}
