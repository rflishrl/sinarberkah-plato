import { createHash, timingSafeEqual } from "node:crypto";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/api";

const knownTags: string[] = Object.values(CACHE_TAGS);
const bodySchema = z.object({ tags: z.array(z.string()).min(1).max(10) });

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

/** Membandingkan rahasia dengan waktu tetap agar tidak bocor lewat selisih waktu. */
function isAuthorized(request: Request, secret: string) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return timingSafeEqual(hash(token), hash(secret));
}

export async function handleRevalidate(request: Request): Promise<Response> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { error: "REVALIDATE_SECRET belum diisi." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return Response.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const raw = await request.json().catch(() => null);
  const body = bodySchema.safeParse(raw);
  if (!body.success) {
    return Response.json({ error: "Isi permintaan salah." }, { status: 400 });
  }

  const tags = body.data.tags.filter((tag) => knownTags.includes(tag));
  return Response.json({ revalidated: tags });
}

export const Route = createFileRoute("/api/revalidate")({
  server: {
    handlers: {
      POST: async ({ request }) => handleRevalidate(request),
    },
  },
});
