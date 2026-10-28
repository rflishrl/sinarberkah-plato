# Sinar Berkah website

The public website for Sinar Berkah, a metal fabrication workshop in Malang, East Java. The workshop cuts steel plate, acrylic, PVC, and MDF, makes decorative ornament panels, and builds gates, stair railings, canopies, and screens. It has worked in industry, fabrication, and construction for more than five years and ships orders across Indonesia.

Visitors browse the services, products, past projects, and patterns, then place an order on WhatsApp. The site has no checkout.

The products, projects, and patterns come from a separate project, `sinarberkah-backend`. The workshop owner adds products, portfolio projects, and patterns there, and this site displays them.

## Pages

| Path         | What it shows                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `/`          | Home page: hero slider, about, services, delivery banner, portfolio, pattern gallery, promo, materials, contact and map |
| `/products`  | Product list with search and a WhatsApp link on each product                                                            |
| `/portfolio` | Projects the workshop has built                                                                                         |
| `/gallery`   | Pattern gallery                                                                                                         |
| `/article`   | Articles. The backend has no article feature yet, so this page shows an empty message                                   |

Old addresses `/cart` and `/produk` redirect to `/products`.

## Where the data comes from

| Content                                 | Source                |
| --------------------------------------- | --------------------- |
| Products, portfolio projects, patterns  | Backend API           |
| Hero slides, services, materials        | `src/data/content.ts` |
| Phone numbers, address, map, navigation | `src/data/site.ts`    |

The site reads the API on the server, waits at most 6 seconds, retries once, and checks the shape of every answer. Lists are fetched page by page (100 items per page, up to 10 pages), so nothing is cut off. It caches each answer for one hour. When the backend has `FRONTEND_URL` and `REVALIDATE_SECRET` set, saving in the admin panel clears the cache at once, so changes show up right away. If the API is down while a page rebuilds, the site keeps the last good page. It never swaps in sample content. A section with no data shows an empty message.

The pages are built ahead of time, so `npm run build` needs the backend to be reachable. If it is not, the build stops with `Gagal memuat /api/...` and Vercel keeps the previous deployment live. Deploy the backend first.

Photos uploaded through the admin panel live in Vercel Blob. Next.js optimizes them for you, so a phone downloads a smaller file than a desktop.

## Tech stack

- Next.js 16 (App Router) and React 19
- TypeScript 5.9 in strict mode
- Tailwind CSS 4
- `next/font` for Mulish and Open Sans
- `react-icons` for icons

## Getting started

You need Node.js 20.9 or newer.

```bash
npm install
```

Create `.env.local` from the example:

```bash
copy .env.example .env.local      # Windows
# cp .env.example .env.local      # macOS / Linux
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable               | Purpose                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_BASE_URL`         | Backend address without a trailing slash. In development it defaults to `http://localhost:4000`. In production it defaults to `https://sinarberkah-backend.vercel.app`. |
| `REVALIDATE_SECRET`    | Secret for `POST /api/revalidate`, the same value as in the backend. Leave empty to turn the endpoint off.                                                              |
| `NEXT_PUBLIC_SITE_URL` | Public address of this site. Used for the sitemap, `robots.txt`, and page metadata                                                                                      |

Restart `npm run dev` after you change `.env.local`.

### Commands

| Command             | What it does                   |
| ------------------- | ------------------------------ |
| `npm run dev`       | Starts the development server  |
| `npm run build`     | Builds for production          |
| `npm run start`     | Runs the production build      |
| `npm run lint`      | Checks the code with ESLint    |
| `npm run typecheck` | Checks TypeScript types        |
| `npm test`          | Runs the tests (Vitest)        |
| `npm run format`    | Formats the code with Prettier |

## Design

The layout follows the Figma file "PLATO Landing Page" (Version 2). The colors are the Figma values:

| Name                     | Value     |
| ------------------------ | --------- |
| Orange (buttons, labels) | `#FF7062` |
| Dark text                | `#222222` |
| Page background          | `#F7F7F7` |

Headings use Mulish and body text uses Open Sans. The design tokens sit at the top of `src/app/globals.css`.

The site works from phone width (375 px) to wide desktop screens. A few details:

- The hero is a slider with previous and next buttons. It moves only when the visitor clicks.
- The pattern gallery and the portfolio row scroll by themselves on a desktop with a mouse, and pause while the pointer is over them. On phones and tablets visitors swipe, and dots show the position.
- Nothing moves on its own when the visitor's system asks for reduced motion.
- The navigation collapses into a menu button below 1024 px.
- The page has a skip link, visible focus rings, and descriptive labels on icon buttons.

One known limit: white text on the Figma orange has a contrast ratio of about 2.8 to 1, which is below the 4.5 to 1 that WCAG AA asks for. To use a darker orange, change `--color-brand` in `src/app/globals.css`.

## Editing content

Most changes need no code beyond one data file.

- Change a phone number, the address, the map, or a menu link in `src/data/site.ts`. The site uses two WhatsApp numbers: one for general questions and one for orders.
- Change the hero slides, services, or materials in `src/data/content.ts`.
- Add products, portfolio projects, or patterns in the backend admin panel at `/admin`, not in this repository.

Some values in `src/data/site.ts` are still empty: the business email, the social media links, and the video link. The page hides the email and the social links until you fill them in. The "watch video" button in the about section stays inactive until the video link exists.

## Project layout

```
src/
  app/             Pages, layout, sitemap, robots.txt, error and 404 pages
  components/
    layout/        Navbar and footer
    sections/      Home page sections, product grid, portfolio and pattern carousels
    ui/            Button, section heading, page header, image wrapper
  data/            Site settings and static content
  lib/             API client, formatting helpers, WhatsApp links, media query hook
  types/           TypeScript types for API data
public/images/     Local photos and banner images
```

## Deploying to Vercel

1. Push this repository to GitHub and import it at [vercel.com/new](https://vercel.com/new).
2. Add the environment variables `API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, and `REVALIDATE_SECRET` (the same value as in the backend).
3. Deploy.

`vercel.json` runs the site in Singapore (`sin1`), the closest region to Indonesia. Deploy the backend first, because this site needs its address. The backend README has the full steps.

To see an admin change right away, redeploy the site. Vercel then rebuilds the pages with fresh data.
