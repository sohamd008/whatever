# soham.eu.cc

Astro + React powers the personal site at [soham.eu.cc](https://soham.eu.cc): a portfolio shell, a browser-based toolbox, an arcade of original mini-games, and a Cloudflare-backed URL shortener with a small link-management console.

## What lives here

- `src/pages` contains the routed Astro pages.
- `src/components` contains the React UI used for the homepage, command palette, tools, and supporting views.
- `src/games` contains the arcade titles.
- `functions` contains Cloudflare Pages Functions for the URL shortener and link console.
- `public` contains the service worker, manifest, headers, and other static assets.

## Stack

- Astro 6
- React 19
- Tailwind CSS 4
- Cloudflare Pages Functions + KV for short links

## Local development

Install dependencies:

```bash
npm install
```

Run the Astro app:

```bash
npm run dev
```

Run the normal quality checks:

```bash
npm run check
```

If you want to preview the built site with Cloudflare Pages locally:

```bash
npm run preview:pages
```

## Shortener setup

The shortener and `/terminal` console need Cloudflare configuration.

Required runtime pieces:

- KV namespace bound as `LINKS`
- Environment variable `TERMINAL_PASS`

For local function testing, create a `.dev.vars` file from `.dev.vars.example`:

```bash
cp .dev.vars.example .dev.vars
```

Then set:

```env
TERMINAL_PASS=your-secret-value
```

KV bindings are usually added in Cloudflare Pages project settings for this repo.

## Scripts

- `npm run dev` starts Astro locally
- `npm run build` builds the static site
- `npm run preview` previews the Astro build locally
- `npm run lint` runs ESLint
- `npm run check` runs lint + build
- `npm run preview:pages` serves the built output through `wrangler pages dev`

## Notes

- Most tools are local-first and run entirely in the browser.
- The QR generator depends on the external QRServer API.
- `/terminal` is meant to be an internal utility route and is excluded from indexing.
