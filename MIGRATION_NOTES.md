# Migration Notes: TanStack Start -> SvelteKit 3 (`sinarberkah-plato`)

Audit Fase 0 (sebelum perubahan kode aplikasi). Target deployment: Vercel Hobby (Node.js >= 22.17 via `@sveltejs/adapter-vercel`), package manager: Bun (`bun.lock`).

---

## 1. Daftar Rute

Tidak ada rute berparameter (`$param`) pada `sinarberkah-plato`.

| File Route TanStack | URL Final | Statis / Dinamis | Detail & Catatan Migrasi |
|---|---|---|---|
| `src/routes/__root.tsx` | *(Root layout)* | Layout dinamis | `createRootRoute`: `head()`, `errorComponent: RootErrorComponent`, `notFoundComponent: RootNotFoundComponent`, `Navbar`, `<main id="main-content">`, `Footer`, impor `globals.css?url`. |
| `src/routes/index.tsx` | `/` | Dinamis (SSR + streaming) | `loader` mengembalikan unawaited `portfolioPromise` (`getHomePortfolioServerFn`) & `galleryPromise` (`getHomeGalleryServerFn`) dengan `<Suspense>` + `<Await>`. Merender `JsonLd` (`LocalBusiness`). |
| `src/routes/products.tsx` | `/products` | Dinamis (SSR + query `?q=`) | `validateSearch: productSearchSchema` (`q` max 100 char). `loader` memanggil `getProductsServerFn()`. Pencarian client-side menyinkronkan `?q=` dengan `replace: true`. Merender `JsonLd` (`ItemList`). |
| `src/routes/produk.tsx` | `/produk` | Redirect permanen (`308`) | `beforeLoad` melempar `redirect({ to: "/products", search: { q: "" }, statusCode: 308 })`. Juga diduplikasi di `vercel.json`. |
| `src/routes/cart.tsx` | `/cart` | Redirect permanen (`308`) | `beforeLoad` melempar `redirect({ to: "/products", search: { q: "" }, statusCode: 308 })`. Juga diduplikasi di `vercel.json`. |
| `src/routes/portfolio.tsx` | `/portfolio` | Dinamis (SSR) | `loader` memanggil `getPortfolioServerFn()`. |
| `src/routes/gallery.tsx` | `/gallery` | Dinamis (SSR) | `loader` memanggil `getGalleryServerFn()`. |
| `src/routes/article.tsx` | `/article` | Dinamis (SSR) | `loader` memanggil `getArticlesServerFn()`. `head` menyetel `noIndex: true`. Saat ini tidak dimasukkan di `footerLinks` maupun `sitemap.xml`. |
| `src/routes/robots[.]txt.ts` | `/robots.txt` | Statis / endpoint server (`GET`) | `text/plain; charset=utf-8`, `Allow: /`, `Sitemap: ${siteConfig.url}/sitemap.xml`, `Cache-Control: public, max-age=86400, s-maxage=86400`. |
| `src/routes/sitemap[.]xml.ts` | `/sitemap.xml` | Statis / endpoint server (`GET`) | `application/xml; charset=utf-8` untuk `["", "/portfolio", "/gallery", "/products"]`, `Cache-Control: public, max-age=86400, s-maxage=86400`. |
| `src/routes/api/revalidate.ts` | `/api/revalidate` | Dinamis / API (`POST`) | Webhook invalidasi cache dengan Bearer `REVALIDATE_SECRET`. |

---

## 2. Sumber Data Saat Ini & Cara Akses

- **Data statis lokal**:
  - `src/data/site.ts`: `siteConfig` (profil usaha, alamat, nomor WhatsApp `6281274000418`, koordinat, `mapEmbedUrl`, `aboutVideoUrl: undefined`, `socialLinks: []`), `navLinks`, `footerLinks`.
  - `src/data/content.ts`: `heroSlides`, `services` (beserta ikon `react-icons`), `materials`, dan `patternSlides` (fallback).
- **Backend REST API (`sinarberkah-backend`)** via `src/lib/api.ts` & `src/types/api.ts`:
  - Base URL dari `API_BASE_URL` (wajib di `NODE_ENV === "production"`, default `http://localhost:4000` saat dev).
  - `fetch()` langsung dengan `AbortSignal.timeout(6_000)`, retry 1x (`RETRY_DELAY_MS = 500`) untuk error jaringan/timeout/5xx/429, fail-fast untuk 4xx lainnya.
  - Paginasi otomatis (`limit=100`, `MAX_PAGES = 10`), mendukung skema respons baru (`{ success, data: { items, pagination } }`) maupun legacy (`{ data, meta }`), serta skip item yang gagal validasi Zod tanpa menggagalkan seluruh daftar.
  - Endpoint yang diakses:
    - `getPortfolio(options?)` -> `GET /api/gallery/v1/portfolio`
    - `getGallery(options?)` -> `GET /api/gallery/v1`
    - `getProducts()` -> `GET /api/products/v1`
    - `getArticles()` -> `GET /api/article/v1`
- **Status caching**: Tidak ada lapisan cache aktif; parameter `_tag: CacheTag` di `requestJson()` tidak dipakai (sisa migrasi Next.js sebelumnya).

---

## 3. Server Function, Endpoint API, Middleware, dan Form

- **Server Functions (`src/lib/server-fns.ts`)** (semuanya `GET`, menangkap error dan mengembalikan `[]` dengan `console.error`):
  - `getPortfolioServerFn`
  - `getHomePortfolioServerFn` (`limit: 6, maxPages: 1`)
  - `getGalleryServerFn`
  - `getHomeGalleryServerFn` (`limit: 12, maxPages: 1`)
  - `getProductsServerFn`
  - `getArticlesServerFn`
- **Endpoint API**:
  - `POST /api/revalidate` (`src/routes/api/revalidate.ts`): memeriksa `REVALIDATE_SECRET` (`503` jika belum diset), memverifikasi `Authorization: Bearer <token>` dengan SHA-256 + `crypto.timingSafeEqual` (`401` jika salah), memvalidasi `{ tags: string[] }` (`min(1).max(10)`), memfilter terhadap `CACHE_TAGS`, lalu mengembalikan `{ revalidated: tags }`. **Tidak menulis data** (hanya endpoint operasional/webhook internal yang dilindungi Bearer secret; tetap perlu dicatat untuk Prompt 2).
  - `GET /robots.txt` & `GET /sitemap.xml`.
- **Server Helper**:
  - `src/server/turnstile.ts`: `verifyTurnstile(token, expectedAction, clientIp?)` memanggil `https://challenges.cloudflare.com/turnstile/v0/siteverify` (timeout 5 detik). **Saat ini tidak diimpor/dipanggil oleh rute atau form mana pun.**
- **Middleware**: Tidak ada middleware global pada TanStack Start.
- **Form & Interaksi Client**:
  - Tidak ada `<form>` atau mutasi data pengguna/anonim di frontend.
  - `ProductGrid` (`src/components/sections/product-grid.tsx`) memiliki `<input type="search">` untuk filter produk client-side dan sinkronisasi URL `?q=`.
  - CTA WhatsApp via `whatsappLink()` (`src/lib/whatsapp.ts`) mengarah ke `https://wa.me/...` (`Navbar`, `Footer`, `BannerSection`, `Materials`, `Contact`, `ProductGrid`).
  - Komponen `TurnstileField` (`src/components/ui/turnstile-field.tsx`) ada tetapi **belum terhubung/tidak dipakai**.

---

## 4. Login/Admin & Modul Cloudflare R2

- **Login / Admin**: **Tidak ada** pada repo `sinarberkah-plato`. Seluruh panel admin berada di `sinarberkah-backend`.
- **Cloudflare R2 Server Upload**: **Tidak ada** kode klien S3/R2, `sharp`, quota guard, maupun endpoint upload pada `sinarberkah-plato`.
- **URL Media Publik R2**:
  - `src/lib/media-url.ts` memvalidasi dan membentuk URL gambar publik menggunakan `VITE_MEDIA_PUBLIC_DOMAIN` (saat migrasi ke SvelteKit menjadi `PUBLIC_MEDIA_PUBLIC_DOMAIN` atau dipertahankan dengan fallback/penyesuaian env sesuai aturan `$env/static/public`, **tanpa mengubah format URL R2 maupun origin custom domain**).
  - `isAllowedMediaUrl()` mengizinkan path lokal `/...` (menolak `//...`), origin `MEDIA_PUBLIC_DOMAIN`, dan `http://localhost:4000` saat `NODE_ENV !== "production"`.
  - `deriveThumbUrl()` mengganti akhiran `.webp` menjadi `-thumb.webp` khusus untuk URL dari origin custom domain R2.
  - `MediaImage` (`src/components/ui/media-image.tsx`) merender `<img>` dengan `loading`, `decoding="async"`, `fetchPriority`, dan fallback `onError` dari thumbnail ke URL penuh.

---

## 5. Daftar Dependency React-Spesifik & Padanan SvelteKit 3

| Paket Saat Ini (`sinarberkah-plato`) | Kategori | Padanan SvelteKit 3 / Rilis Target |
|---|---|---|
| `@tanstack/react-start` (`1.169.4`), `@tanstack/react-router` (`1.170.46`) | Framework & Router | `@sveltejs/kit` (3.x stable), `@sveltejs/adapter-vercel` (7.x stable) |
| `react` (`19.3.1`), `react-dom` (`19.3.1`), `@types/react`, `@types/react-dom` | UI Runtime | `svelte` (5.x stable, runes) |
| `@vitejs/plugin-react` (`6.2.1`), `nitro` (`3.0.261103-rc`) | Build / Server Adapter | `@sveltejs/vite-plugin-svelte` (7.x stable) + `@sveltejs/adapter-vercel` (7.x) |
| `react-icons` (`5.7.0` — `md` & `fa6`) | Ikon | `@lucide/svelte` atau komponen SVG lokal ringan untuk ikon Material/WhatsApp agar tampilan tetap identik |
| `@marsidev/react-turnstile` (`^1.6.3`) | Widget Turnstile (orphaned) | Dihapus jika komponen Turnstile tidak dipakai, atau wrapper `<script>` native Cloudflare Turnstile jika dipertahankan |
| `tailwindcss` (`4.3.5`), `@tailwindcss/vite` (`4.3.5`) | Styling | Tetap Tailwind v4 (`4.3.5`) + `@tailwindcss/vite` (`4.3.5`) bersama token di `globals.css` |
| `@fontsource-variable/mulish`, `@fontsource-variable/open-sans`, `zod` | Font & Validasi | Tetap dipertahankan (`5.3.0`, `4.6.7`) |
| `typescript` (`5.9.3`) | Bahasa | Naik ke `typescript` 6.x stable terbaru (`6.0.3`), `svelte-check` (4.x stable) |
| `@biomejs/biome` (`2.6.6`) | Lint & Format | `eslint` + `eslint-plugin-svelte` + `prettier` + `prettier-plugin-svelte` (sesuai scaffold `sv`) |
| `bun test` (unit/contract) | Pengujian | `vitest` (5.x stable) + `@playwright/test` (1.x stable) |

*(Catatan versi paket akan difinalisasi setelah instalasi di Fase 1 dan diverifikasi ulang di Fase 7.)*

---

## 6. Daftar Environment Variable

| Nama Env Saat Ini | Sifat | Kegunaan | Catatan Migrasi SvelteKit 3 |
|---|---|---|---|
| `API_BASE_URL` | Private (Server) | URL base `sinarberkah-backend` | Baca via `$env/dynamic/private` |
| `REVALIDATE_SECRET` | Private (Server) | Bearer token `POST /api/revalidate` | Baca via `$env/dynamic/private` |
| `TURNSTILE_SECRET_KEY` | Private (Server) | Secret verifikasi Turnstile (`src/server/turnstile.ts`, saat ini tidak terpakai) | Baca via `$env/dynamic/private` jika dipertahankan |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Private (Server) | Daftar hostname Turnstile yang diizinkan | Baca via `$env/dynamic/private` jika dipertahankan |
| `VITE_MEDIA_PUBLIC_DOMAIN` | Public (Client & Server) | Custom domain media publik R2 (mis. `https://media-sb.raflisahrul.my.id`) | Ganti ke `PUBLIC_MEDIA_PUBLIC_DOMAIN` (`$env/static/public` atau `$env/dynamic/public`) — perlu konfirmasi pemilik repo atau fallback |
| `NEXT_PUBLIC_SITE_URL` | Public (Client & Server) | Domain kanonik situs (`siteConfig.url`, sitemap, robots, JSON-LD) | Ganti ke `PUBLIC_SITE_URL` (saat ini di React `process.env.NEXT_PUBLIC_SITE_URL` tidak terbaca di browser!) |
| `VITE_TURNSTILE_SITE_KEY` | Public (Client) | Site key Turnstile (`turnstile-field.tsx`, tidak terpakai) | Ganti ke `PUBLIC_TURNSTILE_SITE_KEY` jika dipertahankan |
| `NODE_ENV` | Runtime | Deteksi mode produksi | Standar Node/Vite |

---

## 7. Risiko & Hal Ambigu

1. **Penamaan env var publik (`VITE_*` & `NEXT_PUBLIC_*`)**: SvelteKit 3 menggunakan prefix `PUBLIC_` (`$env/static/public` / `$env/dynamic/public`). Mempertahankan nama `VITE_MEDIA_PUBLIC_DOMAIN` / `NEXT_PUBLIC_SITE_URL` di `.env` Vercel tanpa penyesuaian akan memengaruhi setup Vercel. Perlu keputusan apakah env publik di Vercel akan diperbarui ke `PUBLIC_MEDIA_PUBLIC_DOMAIN` dan `PUBLIC_SITE_URL` (atau perlu didukung sementara lewat `envPrefix` / fallback server).
2. **Kode mati / sisa migrasi sebelumnya**: `src/components/sections/pattern-gallery.tsx` (`PatternGallery`), `src/components/ui/content-image.tsx`, `src/components/ui/turnstile-field.tsx`, dan `src/server/turnstile.ts` saat ini tidak digunakan oleh rute mana pun. Perlu konfirmasi apakah modul Turnstile yang belum terpakai perlu ikut dipindahkan atau boleh dibersihkan.
3. **Node.js lokal belum terpasang pada PATH**: Di lingkungan lokal saat ini hanya tersedia `bun` `1.4.4`, sedangkan `node` belum tersedia di PATH. Vercel Adapter 7 mewajibkan Node.js >= 22.17 di Vercel, dan beberapa tool (seperti `svelte-check` / Playwright / Vite build) perlu diuji kompatibilitas eksekusinya via Bun atau instalasi Node >= 22.17 lokal.
4. **Perilaku `/api/revalidate`**: Saat ini merupakan stub yang mengembalikan `{ revalidated }` tanpa membersihkan cache karena `fetch` di `api.ts` memang tidak di-cache. Perlu dipastikan apakah tetap dipertahankan sebagai SSR langsung (tanpa cache) + stub `/api/revalidate` agar kontrak dengan `sinarberkah-backend` tidak rusak.
5. **Versi TypeScript**: `npm` telah merilis TypeScript `7.0.2`, sedangkan prompt meminta `typescript` **6.x terbaru** (`6.0.3`). Kita akan memasang `typescript@6.0.3` agar sesuai batasan versi prompt.

---

## 8. Baseline Screenshot (`.baseline-screenshots/before/`)

Diambil menggunakan Playwright Chromium terhadap `sinarberkah-plato` (TanStack Start `vite dev` di `http://127.0.0.1:3000`):

| File | URL / State | Viewport | HTTP Status |
|---|---|---|---|
| `.baseline-screenshots/before/home-desktop.png` | `/` | `1440x900` | `200` |
| `.baseline-screenshots/before/home-mobile.png` | `/` | `390x844` | `200` |
| `.baseline-screenshots/before/home-mobile-menu-open.png` | `/` (drawer/menu mobile terbuka) | `390x844` | `200` |
| `.baseline-screenshots/before/products-desktop.png` | `/products` (redirect client `?q=`) | `1440x900` | `200` |
| `.baseline-screenshots/before/products-mobile.png` | `/products` (redirect client `?q=`) | `390x844` | `200` |
| `.baseline-screenshots/before/portfolio-desktop.png` | `/portfolio` | `1440x900` | `200` |
| `.baseline-screenshots/before/portfolio-mobile.png` | `/portfolio` | `390x844` | `200` |
| `.baseline-screenshots/before/gallery-desktop.png` | `/gallery` | `1440x900` | `200` |
| `.baseline-screenshots/before/gallery-mobile.png` | `/gallery` | `390x844` | `200` |
| `.baseline-screenshots/before/article-desktop.png` | `/article` | `1440x900` | `200` |
| `.baseline-screenshots/before/article-mobile.png` | `/article` | `390x844` | `200` |
| `.baseline-screenshots/before/not-found-desktop.png` | `/halaman-tidak-ada-404` (404 state) | `1440x900` | `404` |
| `.baseline-screenshots/before/not-found-mobile.png` | `/halaman-tidak-ada-404` (404 state) | `390x844` | `404` |

*(Rute `/produk` dan `/cart` berupa redirect permanen `308` ke `/products`.)*

---

## 9. Hasil Migrasi & Verifikasi Akhir (Fase 1–7)

### Keputusan & Implementasi SvelteKit 3
- **Konfigurasi & Alias**: Seluruh konfigurasi SvelteKit 3 diletakkan di `vite.config.ts` lewat plugin `sveltekit({...})` (**tanpa `svelte.config.js`**), dengan `@sveltejs/adapter-vercel` (`runtime: 'nodejs24.x'`, `regions: ['sin1']`) dan `imports` `#lib` / `#lib/*` di `package.json`.
- **Variabel Lingkungan**:
  - Publik (`$env/static/public`): `PUBLIC_MEDIA_PUBLIC_DOMAIN`, `PUBLIC_SITE_URL` (dengan fallback `process.env.VITE_MEDIA_PUBLIC_DOMAIN` / `process.env.NEXT_PUBLIC_SITE_URL` di `src/env.ts` agar variabel lama tetap aman).
  - Privat (`$env/dynamic/private`): `API_BASE_URL`, `REVALIDATE_SECRET`.
- **Modul tidak terpakai yang dibersihkan**: `TurnstileField`, `server/turnstile.ts`, `PatternGallery`, dan `ContentImage` (orphaned dari proyek lama) tidak diport ke UI aktif agar tidak menambah bobot bundle.
- **Navigasi & UI**: `ProductGrid` menggunakan `goto` (`replaceState: true`) untuk sinkronisasi `?q=`. Drawer menu mobile pada `Navbar` memakai `<dialog>` native (`showModal()`, `overscroll-behavior: contain`, tinggi `100svh`). Gambar LCP hero dan avatar `AboutSection` memakai `fetchpriority="high"` tanpa `loading="lazy"`.
- **Revalidasi (`POST /api/revalidate`)**: Tetap dipertahankan dengan verifikasi Bearer `REVALIDATE_SECRET` (`crypto.timingSafeEqual`) sebagai kontrak untuk `sinarberkah-backend`.

### Versi Paket Final (`package.json`)
- `@sveltejs/kit`: `^3.2.1` (tetap di `3.2.1`; `3.3.0` dirilis 2026-11-17 sehingga dihindari sesuai aturan < 14 hari)
- `svelte`: `^5.57.3`
- `vite`: `^8.3.8`
- `@sveltejs/vite-plugin-svelte`: `^7.3.1`
- `@sveltejs/adapter-vercel`: `^7.0.4`
- `typescript`: `~6.0.3` (tetap di major `6.x`, bukan `7.0.2`)
- `svelte-check`: `^4.7.8`
- `tailwindcss` & `@tailwindcss/vite`: `4.3.5`
- `@lucide/svelte`: `^1.74.0`, `zod`: `4.6.7`, `@fontsource-variable/mulish` & `@fontsource-variable/open-sans`: `5.3.0`
- `vitest`: `^5.1.0`, `@playwright/test`: `^1.65.1`, `eslint`: `^10.15.0`, `prettier`: `^3.10.1`

### Status Verifikasi Pasca-Pembersihan
- **Pembersihan**: `.legacy/`, `public/`, `biome.json`, `components.json`, dan seluruh dependency React/TanStack/Biome/Nitro telah dihapus dan `bun.lock` diperbarui.
- **Screenshot Before/After**: Tersimpan di `.baseline-screenshots/before/` dan `.baseline-screenshots/after/` (diabaikan di `.gitignore`) untuk viewport desktop `1440x900` dan mobile `390x844`.
- **Setting Manual Vercel**: Pastikan Node.js Version di Project Settings Vercel diset ke **24.x** (minimum `>= 22.17`) dan set env `PUBLIC_SITE_URL`, `PUBLIC_MEDIA_PUBLIC_DOMAIN`, `API_BASE_URL`, `REVALIDATE_SECRET`.
