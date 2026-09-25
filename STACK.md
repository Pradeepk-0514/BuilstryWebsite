# Builstry GenLab-style site — production stack

This scraped content snapshot has been converted into an executable Next.js application while preserving the captured Markdown, route manifest, scraper, and asset notes.

## Runtime stack

| Area | Implementation |
|---|---|
| Framework | Next.js 15 App Router with React 19 server components and static generation |
| Styling | Tailwind CSS v4 through `@tailwindcss/postcss`, with the Builstry palette in `app/globals.css` |
| Animation | Framer Motion reveal transitions and mobile-navigation presence animations |
| Icons | Lucide React |
| Visuals | Local PNG/WebP/SVG-compatible assets in `public/assets`; UI uses local optimized WebP team assets where available |
| Hosting | Vercel-ready `vercel.json` with the Next.js framework preset |

## Routes

The migrated app includes `/`, `/brand`, `/products`, `/people`, and `/verify-certificate`, plus Builstry-oriented content routes generated through `app/[slug]/page.js`.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

The production build has been verified with `npm run build`. Vercel can deploy this repository directly using the detected Next.js preset.

## Content provenance

The original scrape remains available in `content/`, `SITE_STRUCTURE.md`, `site.json`, `assets.txt`, and the Python scraper files. GenLab-specific copy is used as a captured reference source; the executable UI uses Builstry naming, palette, contact language, and calls to action.
