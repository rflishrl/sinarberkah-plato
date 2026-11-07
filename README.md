# Sinar Berkah Website

The official public website for **Sinar Berkah**, an industrial metal fabrication and laser cutting workshop in Malang, East Java, Indonesia. The workshop specializes in precision steel plate cutting, acrylic, PVC, and MDF fabrication, decorative architectural ornament panels, custom entrance gates, stair railings, canopies, and partitions.

Visitors can explore available services, materials, product catalogs, past project showcases, and pattern collections, then initiate custom inquiries directly through WhatsApp.

Content for products, portfolio items, and ornamental patterns is managed through a companion backend service (`sinarberkah-backend`).

---

## Tech Stack

- **Framework**: TanStack Start with Vite & Nitro (SSR, Server Functions & Streaming)
- **Router**: TanStack Router (100% type-safe file-based routing)
- **Runtime & Package Manager**: Bun 1.4+
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Typography**: `@fontsource-variable/mulish` and `@fontsource-variable/open-sans` (self-hosted variable fonts)
- **Language**: TypeScript 5.9 (Strict mode)
- **Testing**: Vitest 5
- **Icons**: React Icons (Material Design & FontAwesome)
- **Data Validation**: Zod 4

---

## Getting Started

### Prerequisites

You need [Bun](https://bun.sh) (version 1.0 or newer).

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

Create `.env.local` from the provided template:

```bash
copy .env.example .env.local    # Windows
# cp .env.example .env.local    # macOS / Linux
```

### 3. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Commands

| Command                | Action                                             |
| ---------------------- | -------------------------------------------------- |
| `bun dev`              | Starts the local Vite development server           |
| `bun run build`        | Builds the production bundle with Vite & Nitro     |
| `bun run start`        | Runs the compiled production server                |
| `bun run lint`         | Checks code syntax and TanStack Router rules       |
| `bun run typecheck`    | Validates TypeScript types with `tsc --noEmit`     |
| `bun test`             | Executes unit and API validation tests with Vitest |
| `bun run format`       | Formats files with Prettier                        |
| `bun run format:check` | Verifies code adherence to Prettier guidelines     |

### API Contract Testing

Frontend API types in `src/types/api.ts` are verified against the backend schema using contract tests. To run them against a local backend instance:

```bash
# Windows PowerShell
$env:CONTRACT_API_URL="http://localhost:4000"; bun test

# Linux / macOS
CONTRACT_API_URL="http://localhost:4000" bun test
```

---

## Environment Variables

| Variable               | Description                                                                                           | Requirement                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `API_BASE_URL`         | Base URL of the backend API without a trailing slash (e.g. `http://localhost:4000` or production URL) | Required in production                      |
| `REVALIDATE_SECRET`    | Secret key matching the backend for on-demand revalidation at `POST /api/revalidate`                  | Optional (Required for instant cache purge) |
| `NEXT_PUBLIC_SITE_URL` | Public site domain used for canonical alternates, `sitemap.xml`, and `robots.txt`                     | Recommended                                 |

---

## Site Pages & Routes

| Path           | Description                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Landing page: hero slider, about, services, delivery guarantees, portfolio carousel, pattern gallery, materials, and Google Maps contact section |
| `/products`    | Product catalog with live search and direct WhatsApp ordering links                                                                              |
| `/portfolio`   | Visual archive of fabricated custom iron and metal projects                                                                                      |
| `/gallery`     | Ornamental pattern gallery with categories                                                                                                       |
| `/article`     | Articles and publications view (reserved for future updates)                                                                                     |
| `/robots.txt`  | Search engine crawler rules                                                                                                                      |
| `/sitemap.xml` | Generated sitemap for indexing                                                                                                                   |

Legacy routes `/cart` and `/produk` automatically issue permanent redirects (308) to `/products`.

---

## Data Fetching & Caching Strategy

- **Incremental Static Regeneration (ISR)**: Public pages cache data with a default revalidation period of 1 hour.
- **Instant Cache Clearing**: When updates are published in the admin panel, the backend issues a webhook to `POST /api/revalidate`, executing `revalidateTag(tag, { expire: 0 })` for immediate updates.
- **Fail-Safe Fallbacks**: If the API is temporarily unreachable during rebuilds, Next.js retains the last known healthy render rather than showing a broken page.
- **Network Resilience**: The API client enforces a 6-second timeout with automated retries on transient network errors.

---

## Modern Web Standards & Accessibility

- **Core Web Vitals Optimization**: The above-the-fold hero slide image is flagged with `priority`, ensuring Next.js sets `fetchpriority="high"` and eliminates lazy-loading delays on the Largest Contentful Paint (LCP) element.
- **Layout Shift Prevention**: Google Maps embed iframes declare explicit fallback dimensions (`width={600}` and `height={450}`) alongside aspect-ratio styling, preventing Cumulative Layout Shift (CLS).
- **Layout Stability**: Configures `scrollbar-gutter: stable` to avoid horizontal layout jumps between scrollable and short views.
- **Touch Targets**: Pattern gallery dot indicators provide an expanded 28px tap target size to ensure effortless interaction on coarse-pointer mobile screens.
- **Gesture Containment**: The pattern carousel container uses `overscroll-behavior-inline: contain` to prevent touch-swiping gestures from triggering browser back/forward navigation.
- **Typographic Balance**: Heading levels use `text-wrap: balance` for symmetrical wrapping across varying viewport widths, and body copy uses `text-wrap: pretty` to eliminate orphaned words.
- **High Contrast Support**: Interactive focus rings automatically adapt to the system highlight color when Forced Colors Mode is active.
- **Reduced Motion Support**: All marquee tracks and auto-advancing carousels automatically pause or convert to manual scroll controls when `prefers-reduced-motion: reduce` is detected.

---

## Project Structure

```
src/
  components/
    layout/     Responsive navigation bar and site footer
    sections/   Hero slider, about, services, materials, pattern gallery, and contact map
    ui/         ButtonLink, ContentImage, PageHeader, SectionHeading, and JsonLd schema
  data/         Static copy, WhatsApp configuration, and service definitions
  lib/          API client, metadata utilities, and WhatsApp URL builders
  routes/       TanStack Router type-safe file-based routes and server functions
  styles/       Global CSS and self-hosted variable font declarations
  types/        TypeScript interfaces for API payloads and frontend components
public/
  images/       Optimized static banners, hero photography, and material swatches
```

---

## Deployment to Vercel

1. Push your repository branch to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Set your environment variables: `API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, and `REVALIDATE_SECRET`.
4. Deploy.

The included `vercel.json` designates deployment to Singapore (`sin1`) for optimal low latency across Indonesia.
