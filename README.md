# Sinar Berkah

Official website for Sinar Berkah, an industrial metal fabrication and laser cutting workshop in Malang, East Java, Indonesia. The workshop produces laser-cut steel plates, acrylic, PVC, and MDF components, architectural ornament panels, entrance gates, stair railings, canopies, and interior partitions.

Visitors can view services, material specifications, product catalogs, project galleries, and pattern collections, then submit custom inquiries directly through WhatsApp.

Product records, portfolio entries, and ornamental patterns are managed through a companion backend service (`sinarberkah-backend`).

---

## Tech Stack

- **Framework**: SvelteKit 3 (`@sveltejs/kit` 3.x) with `@sveltejs/adapter-vercel` 7.x (Node.js 24 serverless runtime in `sin1`)
- **UI Library**: Svelte 5 (runes) with TypeScript 6.x (strict mode)
- **Bundler**: Vite 8.x (`vite.config.ts` holds all SvelteKit configuration)
- **Package Manager**: Bun 1.4+ (`bun.lock`)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Typography**: `@fontsource-variable/mulish` (headings) and `@fontsource-variable/open-sans` (body), self-hosted
- **Linter & Formatter**: ESLint + Prettier (`prettier-plugin-svelte`, `prettier-plugin-tailwindcss`)
- **Icons**: Lucide Svelte (`@lucide/svelte`)
- **Validation**: Zod 4
- **Testing**: Vitest 5.x (unit & contract tests) and Playwright (end-to-end & visual smoke tests)

---

## Getting Started

### Prerequisites

Install [Bun](https://bun.sh) (version 1.4+) and Node.js 22.17+ (24.x LTS recommended for `@sveltejs/adapter-vercel`).

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create `.env.local` from `.env.example`:

```bash
# Windows PowerShell / CMD
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

| Variable                     | Description                                                                                            | Requirement                    |
| :--------------------------- | :----------------------------------------------------------------------------------------------------- | :----------------------------- |
| `API_BASE_URL`               | Base URL of the backend API without a trailing slash (e.g. `http://localhost:4000` or production URL). | Required                       |
| `PUBLIC_MEDIA_PUBLIC_DOMAIN` | Public R2 custom domain for product and gallery images (`https://media-sb.raflisahrul.my.id`).         | Recommended                    |
| `PUBLIC_SITE_URL`            | Public site domain used for canonical links, `sitemap.xml`, and `robots.txt`.                          | Recommended                    |
| `REVALIDATE_SECRET`          | Shared secret token for `POST /api/revalidate`.                                                        | Optional (on-demand refresh)   |

### 3. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Commands

| Command            | Action                                              |
| :----------------- | :-------------------------------------------------- |
| `bun run dev`      | Starts the local Vite development server            |
| `bun run build`    | Compiles production SSR + Vercel output             |
| `bun run preview`  | Previews the compiled production build locally      |
| `bun run check`    | Runs `svelte-kit sync` and `svelte-check`           |
| `bun run lint`     | Verifies Prettier formatting and ESLint rules       |
| `bun run format`   | Formats project files with Prettier                 |
| `bun run test`     | Runs Vitest unit and integration tests              |
| `bun run test:e2e` | Runs Playwright end-to-end tests                    |

### API Contract Testing

Frontend API schemas in `#lib/types/api.js` are verified against the backend schema using contract tests:

```bash
# Windows PowerShell
$env:CONTRACT_API_URL="http://localhost:4000"; bun run test

# Linux / macOS
CONTRACT_API_URL="http://localhost:4000" bun run test
```

---

## Site Pages and Routes

| Path           | Description                                                                                                                                |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `/`            | Landing page: hero slider, workshop introduction, services, materials, portfolio preview, pattern gallery, and Google Maps contact section |
| `/products`    | Product catalog with search filtering (`?q=`) and direct WhatsApp ordering links                                                           |
| `/portfolio`   | Archive of custom fabrication projects categorized by work type                                                                            |
| `/gallery`     | Ornamental pattern gallery with full pattern previews                                                                                      |
| `/article`     | Articles and publications view (reserved for future content updates)                                                                       |
| `/robots.txt`  | Crawler directives linking to the sitemap                                                                                                  |
| `/sitemap.xml` | Generated sitemap for search engine indexing                                                                                               |

Legacy paths `/cart` and `/produk` return permanent HTTP 308 redirects to `/products`.

---

## Project Structure

```text
src/
  env.ts              # SvelteKit 3 typed public/private environment variables
  lib/
    components/       # Layout navbar/footer, UI primitives, and landing sections
    data/             # Static copy, WhatsApp config, and service definitions
    server/           # Server-only API fetch client & revalidate verification
    types/            # Zod schemas & TypeScript contracts for backend payloads
  routes/             # SvelteKit 3 file-based routes (+page.svelte, +page.server.ts, +server.ts)
  styles/             # Global CSS and self-hosted variable font declarations
static/               # Favicons and static photography (/images/**)
test/                 # Vitest tests & Playwright E2E suite
```

---

## Deployment to Vercel

1. Push your branch to your Git remote and import the project into Vercel.
2. **Manual Vercel Project Setting required for SvelteKit 3 (`@sveltejs/adapter-vercel` 7.x)**:
   - Open **Project Settings > Build & Deployment > Node.js Version** and ensure Node.js is set to **24.x** (minimum `>= 22.17`; Node 20 is unsupported in SvelteKit 3 / Vite 8).
   - Verify **Install Command** (`bun install`), **Build Command** (`bun run build`), and **Output Directory** (auto-detected `.vercel/output`).
3. Configure environment variables in **Project Settings > Environment Variables**:

   | Variable                     | Production Value                  | Preview / Dev Value               |
   | :--------------------------- | :-------------------------------- | :-------------------------------- |
   | `API_BASE_URL`               | Production backend URL            | Preview URL or localhost          |
   | `PUBLIC_SITE_URL`            | Production website URL            | Preview URL or localhost          |
   | `PUBLIC_MEDIA_PUBLIC_DOMAIN` | Custom R2 CDN domain (`https://`) | Custom R2 CDN domain (`https://`) |
   | `REVALIDATE_SECRET`          | Shared revalidation secret        | Shared revalidation secret        |

4. Deploy without cache if you change `PUBLIC_*` static build-time variables. The adapter targets region `sin1` (Singapore).
