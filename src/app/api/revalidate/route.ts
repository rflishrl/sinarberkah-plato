import { createHash, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/api";

/**
 * Dipanggil backend setelah admin menyimpan atau menghapus data, supaya perubahan
 * tampil di situs tanpa menunggu cache habis.
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "tags": ["portfolio"] }
 */

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

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET belum diisi." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json(
      { error: "Isi permintaan salah." },
      { status: 400 },
    );
  }

  const tags = body.data.tags.filter((tag) => knownTags.includes(tag));
  // `expire: 0` membuat cache langsung kedaluwarsa, bukan menunggu pengunjung berikutnya.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: tags });
}
