# Sinar Berkah

Official website for Sinar Berkah, an industrial metal fabrication and laser cutting workshop in Malang, East Java, Indonesia. The workshop produces laser-cut steel plates, acrylic, PVC, and MDF components, architectural ornament panels, entrance gates, stair railings, canopies, and interior partitions.

Visitors can view services, material specifications, product catalogs, project galleries, and pattern collections, then submit custom inquiries directly through WhatsApp.

Product records, portfolio entries, and ornamental patterns are managed through a companion backend service (`sinarberkah-backend`).

---

## Tech Stack

- **Framework**: TanStack Start with Vite and Nitro (SSR, server functions, and streaming)
- **Router**: TanStack Router (type-safe file-based routing)
- **Runtime and package manager**: Bun 1.4+
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Typography**: `@fontsource-variable/mulish` (headings) and `@fontsource-variable/open-sans` (body), self-hosted
- **Linter and formatter**: Biome 2.6
- **Language**: TypeScript 5.9 (strict mode)
- **Testing**: Vitest 5
- **Icons**: React Icons (Material Design and FontAwesome)
- **Validation**: Zod 4

---

## Getting Started

### Prerequisites

Install [Bun](https://bun.sh) (version 1.0 or newer).

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create `.env.local` from the template:

```bash
# Windows PowerShell / CMD
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

| Variable               | Description                                                                                           | Requirement                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `API_BASE_URL`         | Base URL of the backend API without a trailing slash (e.g. `http://localhost:4000` or production URL) | Required                                    |
| `REVALIDATE_SECRET`    | Shared secret key for webhook cache invalidation at `POST /api/revalidate`                            | Optional (Required for instant cache purge) |
| `NEXT_PUBLIC_SITE_URL` | Public site domain used for canonical links, `sitemap.xml`, and `robots.txt`                          | Recommended                                 |

### 3. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Commands

| Command                | Action                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `bun dev`              | Starts the local Vite development server                         |
| `bun run build`        | Compiles client assets and server functions with Vite and Nitro  |
| `bun run start`        | Runs the compiled production server                              |
| `bun run check`        | Runs Biome linter, formatter, and import organizer with auto-fix |
| `bun run check:ci`     | Verifies code formatting and lint rules with Biome for CI        |
| `bun run lint`         | Runs Biome lint checks                                           |
| `bun run format`       | Formats project files with Biome                                 |
| `bun run format:check` | Verifies code formatting with Biome without modifying files      |
| `bun run typecheck`    | Validates TypeScript types with `tsc --noEmit`                   |
| `bun test`             | Runs unit and route validation tests with Vitest                 |

### API Contract Testing

Frontend API schemas in `src/types/api.ts` are verified against the backend schema using contract tests. To execute them against a running backend instance:

```bash
# Windows PowerShell
$env:CONTRACT_API_URL="http://localhost:4000"; bun test

# Linux / macOS
CONTRACT_API_URL="http://localhost:4000" bun test
```

---

## Site Pages and Routes

| Path           | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Landing page: hero slider, workshop introduction, services, materials, portfolio preview, pattern gallery, and Google Maps contact section |
| `/products`    | Product catalog with live search filtering and direct WhatsApp ordering links                                                              |
| `/portfolio`   | Archive of custom fabrication projects categorized by work type                                                                            |
| `/gallery`     | Ornamental pattern gallery with full pattern previews                                                                                      |
| `/article`     | Articles and publications view (reserved for future content updates)                                                                       |
| `/robots.txt`  | Crawler directives linking to the sitemap                                                                                                  |
| `/sitemap.xml` | Generated sitemap for search engine indexing                                                                                               |

Legacy paths `/cart` and `/produk` return permanent HTTP 308 redirects to `/products`.

---

## Data Fetching and Caching Strategy

- **Server-side Rendering with Streaming**: The landing page streams portfolio and pattern data via React Suspense, allowing above-the-fold content to render immediately without waiting for API responses.
- **On-demand Cache Revalidation**: When content is updated in the admin panel, the backend issues a webhook to `POST /api/revalidate` with `{ tags: ["portfolio"] }`. Authorization uses constant-time token comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
- **Resilient Network Client**: The API client enforces a 6-second timeout with automated retry on transient 5xx server responses.

---

## Web Standards and Accessibility

- **Core Web Vitals Optimization**: The above-the-fold hero image declares `fetchPriority="high"` and eager loading, eliminating delay on Largest Contentful Paint (LCP). Non-critical images omit unnecessary priority hints to keep HTML standard-compliant.
- **Cumulative Layout Shift Prevention**: Images and embedded maps declare explicit dimensions and aspect-ratio styling to prevent unexpected layout shifts.
- **Color Contrast and Visual Affordance**: The primary brand palette (`#d94435`) satisfies WCAG 2.1 AA contrast requirements against light surfaces and on white-text button labels.
- **Keyboard Navigation**: All interactive elements are reachable via `Tab`, with clearly visible focus outlines that adapt to system highlight colors in high-contrast modes and remain visible over dark imagery.
- **Touch Target Sizing**: Mobile interactive controls provide minimum tap targets of 44px for reliable interaction.
- **Desktop Navigation Controls**: Horizontal sliders and carousels provide dedicated desktop chevron navigation buttons in addition to indicator dots, ensuring accessible pagination for mouse users.
- **Reduced Motion Support**: Carousels, marquee animations, and CSS transitions pause or reduce duration when `prefers-reduced-motion: reduce` is detected.
- **Self-hosted Typography**: Variable font files for Mulish and Open Sans are served directly from the application bundle, avoiding third-party font request latency.

---

## Project Structure

```
src/
  components/
    layout/     Header navigation bar and site footer
    sections/   Hero slider, about, services, materials, pattern gallery, and contact map
    ui/         ButtonLink, ContentImage, PageHeader, SectionHeading, and JsonLd schema
  data/         Static copy, WhatsApp configuration, and service definitions
  lib/          API client, metadata utilities, and WhatsApp URL builders
  routes/       TanStack Router file-based routes and server functions
  styles/       Global CSS and self-hosted variable font declarations
  types/        TypeScript interfaces for API payloads and frontend components
test/           Unit tests for routes, validation schemas, and API handlers
public/
  images/       Static banners, hero photography, and material swatches
```

---

## Deployment to Vercel

1. Push your repository branch to your Git remote.
2. Import the project into the Vercel dashboard.
3. Configure environment variables: `API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, and `REVALIDATE_SECRET`.
4. Deploy.

The project configuration in `vercel.json` designates deployment to Singapore (`sin1`) for low network latency across Indonesia.
