import { describe, expect, it } from "vitest";

import { Route as cartRoute } from "@/routes/cart";
import { productSearchSchema } from "@/routes/products";
import { Route as produkRoute } from "@/routes/produk";

describe("Route redirects (308)", () => {
  it("mengarahkan /cart ke /products dengan status 308", () => {
    try {
      (cartRoute.options.beforeLoad as (ctx: unknown) => void)({});
      expect.fail("Harus melempar redirect");
    } catch (error: unknown) {
      const redirectError = error as {
        status?: number;
        options?: { to?: string; statusCode?: number };
      };
      expect(redirectError.status ?? redirectError.options?.statusCode).toBe(
        308,
      );
      expect(redirectError.options?.to).toBe("/products");
    }
  });

  it("mengarahkan /produk ke /products dengan status 308", () => {
    try {
      (produkRoute.options.beforeLoad as (ctx: unknown) => void)({});
      expect.fail("Harus melempar redirect");
    } catch (error: unknown) {
      const redirectError = error as {
        status?: number;
        options?: { to?: string; statusCode?: number };
      };
      expect(redirectError.status ?? redirectError.options?.statusCode).toBe(
        308,
      );
      expect(redirectError.options?.to).toBe("/products");
    }
  });
});

describe("productSearchSchema validation", () => {
  it("mempertahankan query yang valid", () => {
    const result = productSearchSchema.safeParse({ q: "pagar minimalis" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("pagar minimalis");
    }
  });

  it("melakukan trim pada whitespace", () => {
    const result = productSearchSchema.safeParse({ q: "   ornamen plat   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("ornamen plat");
    }
  });

  it("mereset query ke empty string jika melebihi panjang 100 karakter", () => {
    const longString = "a".repeat(105);
    const result = productSearchSchema.safeParse({ q: longString });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("");
    }
  });

  it("mereset query ke empty string jika tipe data salah", () => {
    const result = productSearchSchema.safeParse({ q: 12345 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("");
    }
  });

  it("memberikan empty string secara default jika q tidak disediakan", () => {
    const result = productSearchSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("");
    }
  });
});
