# About page update guide

## What changed

The About page was completed as a full long-form experience based on the supplied reference composition. It now includes the hero, Why Builstry, Our Philosophy, Three Directions, How We Think, The People Behind Builstry, Bigger Than Its Team, What We Refuse, Our Journey So Far, the final CTA, and the shared footer.

The page palette follows the requested system:

| Token | Use |
| --- | --- |
| Ice white `#F7F8FA` | Main page background, structural sections, and light surfaces. |
| Midnight `#141D26` | Cards, content containers, direction panels, CTA, header/footer shell elements, and visual depth. |
| Magenta `#C51F5D` | Buttons, active states, labels, numbers, icons, links, borders, and eye-catching highlights. |

The previous About king and cube visuals remain removed. The About hero continues to use a lightweight CSS-only abstract visual made from glow, line, grid, beam, and silhouette elements. The global cursor cube trail is still disabled only on `/about`, while other site routes are unchanged.

## Scroll animations

The page uses an IntersectionObserver scroll-trigger system. Sections and cards marked with `data-reveal` enter with a short fade-and-rise transition as they approach the viewport. Repeated items receive staggered delays through the `--delay` custom property.

A fixed magenta scroll progress indicator at the top of the page tracks the user’s position from the beginning to the end of the About route. The journey timeline has its own scroll-triggered draw animation: its magenta line grows across the timeline when the timeline enters view. All non-essential motion is disabled for users who prefer reduced motion.

## Files changed

| File | Purpose |
| --- | --- |
| `src/pages/About.jsx` | Rebuilt the complete page markup and added scroll progress, reveal triggers, stagger delays, and timeline activation. |
| `src/pages/About.css` | Added the complete responsive layout, ice-white/midnight/magenta palette, cards, CTA, timeline, and animation states. |
| `src/components/about/AboutHeroVisual.jsx` | Keeps the king/cube-free CSS-only abstract hero artwork. |
| `src/components/about/AboutHeroVisual.css` | Styles the abstract hero visual. |
| `src/components/Layout.jsx` | Prevents the global cursor cube trail from mounting on `/about`. |
| `public/assets/king_frames/` | Removed unused king animation frames. |

## Run and verify locally

From the project directory:

```bash
npm install
npm run dev
```

Open `http://localhost:5173/about`. Scroll from the hero to the footer to verify the reveal transitions, top progress bar, staggered cards, and journey timeline draw effect. For a production check, run:

```bash
npm run build
```

## Professional interaction pass

The second pass keeps all approved Builstry content and the existing three-color system while upgrading the interaction language across the site. The GenLab reference was used only for interaction direction: editorial rhythm, visual anchors, repeated labels, staged sections, and richer scroll behavior.

The cursor trail is now mounted on the About route as well as the other desktop routes. It uses midnight/magenta geometry plus a live magenta ring, center point, and crosshair so it stays visible on the ice-white canvas. It is disabled for mobile and reduced-motion preferences.

The shared styling now enforces `#C51F5D` as the only magenta accent, replacing historical lighter-pink literals. Major Home, Insights, and shared-route cards receive layered shadows, glass blur, highlight overlays, accent borders, and lift/tilt hover feedback. Generic pages now have stronger hero composition, an orbit visual anchor, numbered content rhythm, interactive arrow markers, and a more dimensional CTA band. Their sections use IntersectionObserver reveal transitions, while the existing About page retains its scroll progress and timeline motion.

The final validation command remains:

```bash
npm run build
```

## Motion tuning and replay behavior

To slow the About page animations, edit the variables at the top of `src/pages/About.css`:

```css
--about-reveal-duration: 1100ms; /* section/card enter and exit speed */
--about-stagger-step: 150ms;     /* delay between cards in a group */
--about-hover-duration: 420ms;   /* card hover lift and surface response */
```

For the shared generic pages, edit the variables near the bottom of `src/styles/global.css`:

```css
--site-reveal-duration: 1100ms;
--site-stagger-step: 150ms;
--site-hover-duration: 420ms;
```

For a slower cinematic feel, try `1400ms` for reveal duration, `190ms` for stagger step, and `520ms` for hover duration. The animation is now repeatable: `src/pages/About.jsx` and `src/pages/GenericPage.jsx` keep observing their elements, add the visible class while an element is inside the viewport, and remove it after the element leaves. Scrolling back to the element therefore triggers the transition again.
