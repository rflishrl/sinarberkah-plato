"use client";

import { useEffect } from "react";

import { buttonStyles } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // `digest` sama dengan kode di log server Vercel, jadi error di browser
    // bisa dicocokkan dengan detail lengkapnya di sana.
    console.error("[page-error]", error.digest ?? error.message, error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 max-w-md text-muted">
        Halaman tidak dapat dimuat saat ini. Silakan coba lagi.
      </p>
      {error.digest && (
        <p className="mt-2 text-sm text-muted">Kode: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className={buttonStyles("primary", "mt-6")}
      >
        Coba Lagi
      </button>
    </section>
  );
}
