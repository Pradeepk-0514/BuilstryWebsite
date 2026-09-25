# genlab.cc — site structure

Scraped 2026-09-24. A React/Vite-style single-page app: every route serves the same HTML shell and the page is built by JavaScript (hashed bundles and images live under `/assets/`).

## Route tree

```
genlab.cc
├── /                     Home  → content/home.md
│     anchors: #about  #verticals  #launchpad  #ai  #brand  #connect
├── /brand                Brand Studio landing   → content/brand.md
├── /products             "GenZ AI Products" (2 demos)  → content/products.md
├── /people               Team (10) + open roles (3 PDFs)  → content/people.md
└── /verify-certificate   Certificate lookup form (no header/footer)  → content/verify-certificate.md
```

Five routes were found by following every link in the rendered pages. There is no `robots.txt` and no `sitemap.xml` (the server answers those paths with the app shell), so navigation is the only way pages are discovered. Routes not linked from anywhere would not appear here.

## Navigation

**Header** (all routes except `/verify-certificate`): Home `/` · Launchpad (no link) · Brand Studio `/brand` · Product `/products` · People `/people` · verify certificate `/verify-certificate` · Shabdam AI (no link)

**Footer** (home, brand, products, people): About `#about` · Verticals `#verticals` · People `/people` · Careers `#connect` · Contact `#connect` · Launchpad `#launchpad` · AI Forge `#ai` · Brand Studio `#brand`. On sub-routes these anchors are written relative to the current route (for example `/people#about`).

## Outbound links

- LinkedIn: https://in.linkedin.com/company/genlabz
- Instagram: https://www.instagram.com/genlab.cc/
- WhatsApp: https://wa.me/919994535120
- Demo, Custom Website Chatbot: https://sns-chatbot.vercel.app/
- Demo, Campus Hub AI: https://campus-bsvvcx30r-neelanjan2448040s-projects.vercel.app/
- Job description PDFs (same site): `/assets/Software_Developer-DOeEZ4H9.pdf`, `/assets/Digital_Marketing_Executive-DF2lvtA4.pdf`, `/assets/Senior_Designer-D0GEKUjP.pdf`
- Contact: `mailto:info@genlab.cc`, `tel:+91999435120`

## Things I noticed

1. **The `tel:` link is wrong.** The footer shows +91 99945 35120, but the link target `tel:+91999435120` has one digit fewer, so tapping it dials a different number. The WhatsApp link has the correct digits (919994535120).
2. **Every route has identical metadata.** Title, description and Open Graph/Twitter tags are the same everywhere, and `og:url` is always the home page, so shared links and search results look the same for every page.
3. **Unknown paths return HTTP 200** with the app shell instead of a 404, which is why `robots.txt` and `sitemap.xml` look "present" but are not real files.
4. **Footer anchors on sub-routes** (`/people#about` etc.) point at section IDs that, in the rendered text, only exist on the home page. Worth checking whether they scroll anywhere.
5. **`/verify-certificate` mentions Terms of Service and Privacy Policy**, but no such pages or links were found.
6. **The Campus Hub AI demo is a Vercel preview-deployment URL** (deployment hash plus an account name), so it may stop working if that deployment is removed.

## Not captured

- FAQ answers (5 questions on the home page render their answers only on click).
- Anything below the fold on `/brand` and `/products` that loads on scroll (only the hero and the two products rendered).
- The image, PDF, CSS, JS and font files themselves (URLs are in `assets.txt`; the crawler in `scraper/` downloads them).
- Five of the seven industry-partner logos are inlined in the page code, so they have no file URL.
- Form behaviour (contact form, certificate lookup) and anything behind them.
