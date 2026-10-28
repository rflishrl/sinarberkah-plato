/** Tampil seketika saat berpindah halaman, selagi data halaman tujuan dimuat. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="container-page space-y-6 py-16 lg:py-24"
    >
      <span className="sr-only">Memuat halaman...</span>
      <div className="mx-auto h-8 w-64 animate-pulse bg-line" />
      <div className="mx-auto h-4 w-full max-w-lg animate-pulse bg-line" />
      <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse bg-line" />
        ))}
      </div>
    </div>
  );
}
