import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, getApiBaseUrl, getGallery, getProducts } from "@/lib/api";

const fetchMock = vi.fn();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const pattern = (id: string) => ({
  _id: id,
  title: `Pola ${id}`,
  type: "LC",
  description: "",
  image: { image_url: "https://a.public.blob.vercel-storage.com/p.jpg" },
});

const calledUrls = () => fetchMock.mock.calls.map(([url]) => String(url));

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe("fetchList (lewat getGallery)", () => {
  it("mengambil semua halaman sampai meta.totalPages", async () => {
    fetchMock
      .mockResolvedValueOnce(
        json({ data: [pattern("1"), pattern("2")], meta: { totalPages: 2 } }),
      )
      .mockResolvedValueOnce(
        json({ data: [pattern("3")], meta: { totalPages: 2 } }),
      );

    const items = await getGallery();

    expect(items.map((item) => item._id)).toEqual(["1", "2", "3"]);
    expect(calledUrls()).toEqual([
      "http://localhost:4000/api/gallery/v1?limit=100&page=1",
      "http://localhost:4000/api/gallery/v1?limit=100&page=2",
    ]);
  });

  it("respons tanpa meta dianggap satu halaman", async () => {
    fetchMock.mockResolvedValueOnce(json({ data: [pattern("1")] }));
    await expect(getGallery()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("item yang rusak dibuang, item lain tetap dipakai", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ data: [pattern("1"), { _id: 2 }], meta: { totalPages: 1 } }),
    );
    const items = await getGallery();
    expect(items.map((item) => item._id)).toEqual(["1"]);
    expect(console.error).toHaveBeenCalled();
  });

  it("bentuk respons yang salah melempar ApiError", async () => {
    fetchMock.mockResolvedValueOnce(json({ items: [] }));
    await expect(getGallery()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("getApiBaseUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("memakai API_BASE_URL tanpa garis miring di akhir", () => {
    vi.stubEnv("API_BASE_URL", "https://api.example.com/");
    expect(getApiBaseUrl()).toBe("https://api.example.com");
  });

  it("di produksi melempar error jika API_BASE_URL kosong", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("API_BASE_URL", "");
    expect(() => getApiBaseUrl()).toThrow(/API_BASE_URL/);
    await expect(getProducts()).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("requestJson (coba ulang)", () => {
  it("mencoba ulang sekali saat 5xx, lalu berhasil", async () => {
    fetchMock
      .mockResolvedValueOnce(json({}, 503))
      .mockResolvedValueOnce(json({ data: [], meta: { totalPages: 0 } }));
    await expect(getProducts()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("tidak mencoba ulang saat 404", async () => {
    fetchMock.mockResolvedValueOnce(json({}, 404));
    await expect(getProducts()).rejects.toThrow("HTTP 404");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("melempar ApiError setelah dua kali gagal jaringan", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(getProducts()).rejects.toThrow(/Gagal memuat.*fetch failed/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
