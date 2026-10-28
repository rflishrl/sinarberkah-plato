import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}));

const { POST } = await import("@/app/api/revalidate/route");

const SECRET = "rahasia-revalidate-uji";

const call = (body: unknown, authorization = `Bearer ${SECRET}`) =>
  POST(
    new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { authorization, "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

beforeEach(() => {
  vi.clearAllMocks();
  process.env.REVALIDATE_SECRET = SECRET;
});

describe("POST /api/revalidate", () => {
  it("503 jika REVALIDATE_SECRET belum diisi", async () => {
    delete process.env.REVALIDATE_SECRET;
    expect((await call({ tags: ["gallery"] })).status).toBe(503);
  });

  it("401 jika rahasia salah", async () => {
    const response = await call({ tags: ["gallery"] }, "Bearer salah");
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("400 jika body tidak valid", async () => {
    expect((await call("{rusak")).status).toBe(400);
    expect((await call({ tags: [] })).status).toBe(400);
  });

  it("hanya membuang tag yang dikenal", async () => {
    const response = await call({ tags: ["gallery", "tidak-dikenal"] });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      revalidated: ["gallery"],
    });
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("gallery", { expire: 0 });
  });
});
