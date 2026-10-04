# Builstry — routing and font fixes

## Implementation

The active build is restored to **Vite + React Router**: `src/main.jsx` mounts the router, and `src/App.jsx` routes the existing Home, About, Insights, certificate and other page modules. `components/RouterLink.jsx` adapts the existing `href`-based navigation markup to React Router, so links stay client-side without a Next.js dependency. The desktop **What We Do** dropdown now opens reliably by click/hover, Insights points to `/insights`, and active navigation state is applied to the current route. `/products` remains a separate working route.

Vercel is configured to build Vite output in `dist/` and rewrite frontend paths to the one SPA entry at `/index.html`. The existing Builstry page styling, layouts, content, GLB/HDRI journey assets and GSAP scene remain in place. The Google font build-time request was removed, and the exact Caveat Brush font face is bundled locally with system fallbacks. A local SVG favicon prevents the browser’s implicit favicon request from generating a 404.

## Validation

`npm run build` completes successfully. A production-browser run confirmed HTTP 200 on direct access and refresh for all 28 tested routes, including `/`, `/about`, `/insights`, `/contact`, `/verify-certificate`, the What We Do destinations, footer routes, `/products`, `/blog` and `/blog/recruitment-systems`. Desktop and mobile navigation, active states, and browser back/forward were also exercised.

The About page rendered its journey section and WebGL canvas; the GLB and HDRI requests returned 200. No Google Fonts requests, failed assets, HTTP errors, page exceptions or console errors were observed. The Vite build reports an optimization warning for the lazy JourneyScene chunk (about 1.14 MB raw / 310 KB gzip); it does not fail the build and is loaded with the 3D scene rather than on every route.
