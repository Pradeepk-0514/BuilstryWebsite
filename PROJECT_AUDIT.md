# Builstry ZIP audit and 3D journey implementation

**Reviewed source:** `Builstry-journey-redesign (1).zip`  
**Date:** 2026-10-03  
**Scope:** source/package/asset review first; then upgrade only the About-page journey and its build inputs while preserving the existing site shell.

## 1. Source archive review (before changes)

The supplied archive contained **84 ZIP entries** under a single `genlab.cc/` project root. It is a Next.js App Router site, with route files in `app/`, shared UI in `components/`, content and source notes in `content/`, `lib/`, and the root Markdown files, and images in `public/assets/`. The archive also contains its scraper/mirror utilities, Next/Tailwind/Vercel configuration, package lockfile, and README/stack/site-structure documentation.

### Application and component structure

The app uses `app/layout.js`, the home route, a dynamic `[slug]` route (including the About page), and `/verify-certificate`. `AboutReferencePage.jsx` composes the About sections and shared header/footer. The pre-change journey was an HTML/CSS/SVG timeline implemented in `OurJourneySection.jsx` and `OurJourneySection.css`; legacy journey selectors also existed in the large global stylesheet. The project had no Three.js/React Three Fiber scene, GLB/GLTF model, HDRI, or 3D timeline runtime before this work. Other sections include the About showcase and approach, five-card mindset section, homepage concept/approach, capabilities, impact, pillars, carousel, FAQ, content pages, header, footer, and shared reveal/intent components.

The 26 component-directory files in the source snapshot were: `AboutReferencePage.jsx`, `AboutReferenceShowcaseSections.jsx/.css`, `ApproachSection.jsx/.css`, `BuildPillars.jsx`, `CapabilitiesScroll.jsx`, `Carousel.jsx`, `CubeStructure.jsx`, `CuriositySection.jsx`, `FAQ.jsx`, `Footer.jsx`, `Header.jsx`, `HomeApproachSections.css`, `HomeConceptScene.jsx`, `ImpactStats.jsx`, `InsightsPage.jsx`, `IntentSection.jsx`, `MindsetInMotionSection.jsx/.css`, `OurJourneySection.jsx/.css`, `Reveal.jsx`, and `WhatWeBuild.jsx`. The updated project adds `JourneyScene.jsx` and `journeyData.js` alongside them.

### Initial dependency baseline

The original runtime dependencies were Next.js `^15.5.4`, React/React DOM `^19.1.1`, Framer Motion `^12.23.24`, and Lucide React `^0.468.0`. Development dependencies included Tailwind CSS 4/PostCSS, TypeScript, and Node/React types. No Three.js, R3F, Drei, GSAP, or postprocessing package was present in the input manifest.

### Assets and supplied reference

The original `public/assets/` contained **20 local image assets** (1 GIF, 10 WebP and 9 PNG, including existing brand/team and partner/profile artwork; approximately 40.4 MB uncompressed). `assets.txt` is a 35-entry captured external-asset URL manifest. Existing local assets were retained.

The reference image `Our Journey_ Milestones Ahead.png` was **not embedded in the supplied ZIP**. It was present as a shared project file, was used for visual direction, and is copied into `design-reference/` in this deliverable for portability. It is a documentation/design input only: the website does not display it as a background or screenshot.

## 2. Delivered implementation

The old flat arrow/card timeline has been replaced with a browser-rendered orthographic Three.js scene in a client-only React Three Fiber Canvas. Milestone years, titles, descriptions, phases, Blender anchor names, and responsive positions are centralized in `components/journeyData.js`.

### Integrated stack

- **Three.js + React Three Fiber:** actual WebGL Canvas, a custom gradient ribbon/tubular journey path, placed animated geometry, a responsive orthographic camera, and milestone projection.
- **Drei:** `useGLTF` loads the Blender-exported GLB; `Environment` loads the local HDRI; `Html` places interactive glass milestone signs in the 3D composition; `Sparkles` adds restrained ambient particles.
- **Blender 4.0.2:** `tools/build_journey_scene.py` deterministically creates named milestone mesh groups and the studio environment. It exports both editable `.blend` source and optimized `.glb` and generates the HDRI. Rebuild from the project root with `blender --background --python tools/build_journey_scene.py`.
- **PBR, GLB/GLTF, and HDRI:** the scene uses Blender Principled materials, with the GLB/HDR served locally from `public/assets/journey/`; Drei applies the HDR environment for reflections and ambient light.
- **GSAP:** `OurJourneySection.jsx` registers `ScrollTrigger`, sequences the editorial introduction, and scrubs scroll progress into the scene rig.
- **Postprocessing:** `@react-three/postprocessing` provides the restrained Bloom and Vignette pass.

The hand-authored composition progresses from the lower area to the summit and flag: curiosity orb/bubbles, a mountain/terrain stage, layered platform geometry, impact bubbles, cubic blocks, network/growth elements, and the final summit/flag. The custom rose-to-lilac ribbon links all seven milestone anchors. Ambient and directional lighting, soft shadows, pearl/glass materials, depth/perspective, gentle floating, low-amplitude pointer parallax, and scroll motion reinforce the dimensional scene while keeping its reference-like pale palette.

Landscape/desktop signs retain the full descriptions. Portrait tablet/phone layouts reduce the plaque footprint; the year/title remain visible and each sign reveals its description on tap/focus/hover. The complete milestone copy also remains in accessible button labels and the ordered screen-reader-only list. A reduced-motion preference disables the motion behaviors. The section occupies one viewport (`100vh`/`100svh`) and the existing About header/navigation/footer remain outside and unchanged.

## 3. Changed and added files

- Updated `package.json` and `package-lock.json` with `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, and `@react-three/postprocessing`.
- Replaced `components/OurJourneySection.jsx` and `components/OurJourneySection.css` with the viewport scene wrapper, accessible milestone layer, and responsive styling.
- Added `components/JourneyScene.jsx` and `components/journeyData.js`.
- Added `tools/build_journey_scene.py`.
- Added `public/assets/journey/builstry-journey.blend`, `builstry-journey.glb`, and `builstry-studio.hdr`.
- Added the supplied visual reference under `design-reference/` (not used by the runtime), and this `PROJECT_AUDIT.md`.

## 4. Validation performed

- `npm run build` completed successfully with Next.js 15.5.26; all 17 static pages were generated.
- Chromium/WebGL browser checks at **1440×900**, **1942×809**, **768×1024**, and **390×844** confirmed the About timeline section is exactly the viewport dimensions, all **7** milestone signs render, no pairwise sign overlaps or horizontal page overflow occur, and a WebGL canvas is present.
- Desktop and phone activation checks returned `aria-pressed=true` and expanded the milestone description. GLB and HDR requests both returned HTTP 200. No JavaScript/page errors or failed network requests were observed.
- The archive is designed to be installed with `npm install`; `node_modules/`, `.next/`, and local environment/secret files are excluded from the ZIP.

## 5. Scroll-driven animation and final responsive QA (2026-10-03)

The final update adds a pinned, single-viewport journey experience driven by **GSAP ScrollTrigger**. The scene camera follows the same Catmull–Rom curve used to generate the visible ribbon; as progress scrubs forward, the route draws on and the Blender milestone groups, projected signs, bubbles, floating details, cubes, and final summit/flag are revealed in sequence. Motion stays restrained, and the existing single R3F Canvas is reused. The summit plaque uses a width-aware, screen-safe projection on portrait layouts so it stays beside the title without colliding with it or clipping at the viewport edge. Reduced-motion mode shows the complete static journey without pinning.

**Final release checks:** `npm run build` passes with Next.js 15.5.26 and all 17 pages generated. Chromium checks exercised desktop (1440×900), tablet (768×1024), and phone widths 390×844, 360×800, and 320×720 through the beginning, middle, and summit of the pinned scroll. The section stayed one viewport tall; the last milestone remained inside the viewport; the tested final plaque did not overlap the editorial header or preceding milestone; and no horizontal page overflow occurred. The GLB and HDRI each returned HTTP 200. No page/console errors or failed asset requests were observed. A reduced-motion phone check showed all seven signs with no pinned spacer.

## 6. About journey alignment follow-up (2026-10-03)

The editorial heading now reads **OUR JOURNEY / SO FAR.** on desktop, with *JOURNEY* explicitly styled in Builstry magenta; the mobile layout retains a compact stacked heading. The opening camera frame is inset so the 2018 plaque starts beneath the intro, the remaining plaques follow the ascending path as scrolling reveals them, and the journey composition sits lower in the full-screen section. Mid-size landscape uses a separate opening inset to keep the first plaque clear of the promise line.

**Follow-up QA:** production build passes. Chromium checks at 1440×900, 1920×900, 1024×768, and 390×844 show a viewport-height section, no horizontal overflow, the first card below the intro copy, and the requested computed magenta heading color. At the mid-scroll checkpoint the next milestones reveal in sequence. At the near-summit checkpoint the final plaque remains fully inside desktop, wide, and tablet viewports. No browser errors were observed.
