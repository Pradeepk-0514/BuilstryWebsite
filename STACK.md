# Builstry site — production stack

The production app is a **Vite-powered React SPA**. `src/main.jsx` mounts `BrowserRouter`; page modules reuse the existing Builstry UI and the About page’s 3D journey. `components/RouterLink.jsx` keeps the existing `href`-style component markup while routing internally through React Router. There is no Next.js runtime or external font loader in the active build; the About annotations use the locally bundled Caveat Brush WOFF2.

| Area | Implementation |
|---|---|
| Build and dev server | Vite 8 with `@vitejs/plugin-react` |
| UI and routing | React 19 and React Router 6 (`BrowserRouter`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, Builstry global/component CSS, local Caveat Brush font |
| 3D experience | Three.js, React Three Fiber, Drei and React Three Postprocessing |
| Journey animation/assets | GSAP ScrollTrigger, Blender-authored GLB/GLTF, local HDRI and reduced-motion support |
| Supporting UI | Framer Motion and Lucide React |
| Deployment | Vercel builds to `dist/`; the SPA rewrite serves `index.html` for frontend paths |

The route table covers `/`, `/about`, `/insights`, `/blog` and `/blog/:slug`, `/contact`, `/verify-certificate`, and the existing service, product, company, resource and policy paths such as `/industry-solutions`, `/business-product-strategy`, `/innovation-community`, `/capabilities`, `/solutions`, `/ai-forge`, `/brand-studio`, `/team`, `/careers`, `/resources`, `/events`, `/hackathons`, `/products`, `/people`, `/industries`, `/projects`, `/launchpad`, `/brand`, `/faq`, `/privacy-policy` and `/terms-and-conditions`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

The Vite production output is `dist/`. Vercel’s rewrite in `vercel.json` supports direct URL access and refreshes without generating separate HTML files for every route.
