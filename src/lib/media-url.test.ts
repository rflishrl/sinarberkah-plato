import { afterEach, describe, expect, it, vi } from "vitest";

import {
  deriveThumbUrl,
  isAllowedMediaUrl,
  resolveMediaUrl,
} from "@/lib/media-url";
import { isOptimizableImage } from "@/lib/utils";
import { galleryItemSchema, productSchema } from "@/types/api";

const TEST_DOMAIN = "https://media-sb.example.test";
const UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("media-url (sinarberkah-plato)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("hanya mengizinkan domain env, Blob legacy, dan aset lokal", () => {
    expect(isAllowedMediaUrl(`${TEST_DOMAIN}/${UUID}.webp`, TEST_DOMAIN)).toBe(
      true,
    );
    expect(
      isAllowedMediaUrl(`${TEST_DOMAIN}/dev/${UUID}.webp`, TEST_DOMAIN),
    ).toBe(true);
    expect(
      isAllowedMediaUrl(
        "https://a.public.blob.vercel-storage.com/p.jpg",
        TEST_DOMAIN,
      ),
    ).toBe(true);
    expect(isAllowedMediaUrl("/images/hero-1.png", TEST_DOMAIN)).toBe(true);

    expect(
      isAllowedMediaUrl("https://evil.example.com/photo.webp", TEST_DOMAIN),
    ).toBe(false);
    expect(
      isAllowedMediaUrl("//evil.example.com/photo.webp", TEST_DOMAIN),
    ).toBe(false);
    expect(isAllowedMediaUrl("javascript:alert(1)", TEST_DOMAIN)).toBe(false);

    vi.stubEnv("VITE_MEDIA_PUBLIC_DOMAIN", TEST_DOMAIN);
    expect(isOptimizableImage(`${TEST_DOMAIN}/${UUID}.webp`)).toBe(true);
    expect(isOptimizableImage("https://evil.example.com/a.webp")).toBe(false);
  });

  it("menurunkan -thumb.webp secara deterministik hanya untuk host R2 yang dikonfigurasi", () => {
    expect(deriveThumbUrl(`${TEST_DOMAIN}/${UUID}.webp`, TEST_DOMAIN)).toBe(
      `${TEST_DOMAIN}/${UUID}-thumb.webp`,
    );
    expect(deriveThumbUrl(`${TEST_DOMAIN}/dev/${UUID}.webp`, TEST_DOMAIN)).toBe(
      `${TEST_DOMAIN}/dev/${UUID}-thumb.webp`,
    );
    expect(
      deriveThumbUrl(`${TEST_DOMAIN}/${UUID}-thumb.webp`, TEST_DOMAIN),
    ).toBe(`${TEST_DOMAIN}/${UUID}-thumb.webp`);
    expect(
      deriveThumbUrl(
        "https://a.public.blob.vercel-storage.com/old.jpg",
        TEST_DOMAIN,
      ),
    ).toBe("https://a.public.blob.vercel-storage.com/old.jpg");
    expect(deriveThumbUrl("/images/hero-1.png", TEST_DOMAIN)).toBe(
      "/images/hero-1.png",
    );
  });

  it("memilih thumb vs full dan mengembalikan fallback untuk host tak dikenal", () => {
    const full = `${TEST_DOMAIN}/${UUID}.webp`;
    const thumb = `${TEST_DOMAIN}/${UUID}-thumb.webp`;

    expect(
      resolveMediaUrl(full, {
        variant: "thumb",
        thumbUrl: thumb,
        mediaDomain: TEST_DOMAIN,
      }),
    ).toBe(thumb);
    expect(
      resolveMediaUrl(full, { variant: "thumb", mediaDomain: TEST_DOMAIN }),
    ).toBe(thumb);
    expect(
      resolveMediaUrl(full, { variant: "full", mediaDomain: TEST_DOMAIN }),
    ).toBe(full);
    expect(
      resolveMediaUrl("https://evil.example.com/x.webp", {
        variant: "full",
        mediaDomain: TEST_DOMAIN,
      }),
    ).toBe("");
  });

  it("memvalidasi host gambar pada skema Zod produk dan galeri", () => {
    vi.stubEnv("VITE_MEDIA_PUBLIC_DOMAIN", TEST_DOMAIN);

    expect(
      productSchema.safeParse({
        _id: "p1",
        name: "Ornamen Besi",
        category: "Ornamen",
        description: "Deskripsi",
        price: 150000,
        image: {
          image_url: `${TEST_DOMAIN}/${UUID}.webp`,
          thumb_url: `${TEST_DOMAIN}/${UUID}-thumb.webp`,
        },
        isActive: true,
      }).success,
    ).toBe(true);

    expect(
      productSchema.safeParse({
        _id: "p2",
        name: "Tanpa Foto",
        category: "Ornamen",
        description: "",
        price: 100000,
        image: { image_url: "" },
        isActive: true,
      }).success,
    ).toBe(true);

    expect(
      galleryItemSchema.safeParse({
        _id: "g1",
        title: "Host Asing",
        type: "LC",
        description: "",
        image: { image_url: "https://untrusted.example.com/a.webp" },
      }).success,
    ).toBe(false);
  });
});
