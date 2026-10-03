# Builstry About Journey — 3D scene

The About page's **Our Journey So Far** section now uses a real React Three Fiber scene rather than the former SVG/card journey.

## Scene implementation

- `components/JourneyScene.jsx` loads `public/assets/journey/builstry-journey.glb` with Drei `useGLTF`, lights the scene using the bundled HDR environment, adds bloom/vignette postprocessing, and supplies smooth GSAP scroll/parallax motion.
- `components/journeyData.js` is the shared source for the original six milestone dates, wording, icons, desktop anchors, and compact-screen bottom-to-top anchors.
- `components/OurJourneySection.css` frames the desktop scene at exactly one viewport and changes narrow layouts into a tall alternating ascent while keeping every milestone and the summit flag in frame.
- `public/assets/journey/builstry-journey.blend` is the editable Blender source; `.glb` is the runtime asset and `.hdr` is the locally generated studio HDRI.
- `tools/build_journey_scene.py` reproducibly generates the Blender file, GLB, and HDRI without external texture downloads.

## Rebuild the Blender assets

From the project root, with Blender 4.x available:

```bash
blender --background --python tools/build_journey_scene.py
```

Then build and run the Next.js app as usual:

```bash
npm install
npm run build
npm start
```

The cards remain keyboard-focusable HTML labels placed at the corresponding 3D milestone anchors. The scene models and connecting path are separate, responsive meshes; the supplied reference image is not embedded as a background or screenshot.
