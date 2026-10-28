"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();

/**
 * Menampilkan tahun berjalan. Halaman statis menyimpan tahun saat build,
 * jadi komponen ini membaca ulang tahun di browser setelah hidrasi.
 * `serverYear` dipakai untuk HTML awal agar tidak terjadi hydration mismatch.
 */
export function CurrentYear({ serverYear }: { serverYear: number }) {
  const year = useSyncExternalStore(subscribe, getClientYear, () => serverYear);

  return <>{year}</>;
}
