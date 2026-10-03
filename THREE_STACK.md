# Builstry 3D Stack

The existing Builstry pages and visual design are preserved. The project now includes an opt-in 3D foundation for future scenes:

- **Three.js** — WebGL/3D runtime
- **React Three Fiber** — React renderer for Three.js
- **Drei** — helpers including `Environment`, `OrbitControls`, and `useGLTF`
- **GSAP** — timeline and interaction animation
- **React Three Postprocessing** — React effects composer
- **Postprocessing** — effect runtime used by the composer
- **GLB/GLTF** — model loading via Drei's `useGLTF`
- **HDRI lighting** — environment lighting via Drei's `Environment`
- **Blender** — source-authoring workflow; export `.glb` files into `public/models/`

## Opt-in component

`components/three/ThreeStage.jsx` provides a ready-to-use transparent Canvas with HDRI lighting, bloom, orbit controls, GLTF loading, and a GSAP rotation example. It is intentionally not mounted in the current pages so the existing project remains visually unchanged.

Example:

```jsx
import ThreeStage from "../components/three/ThreeStage";

<ThreeStage model="/models/example.glb" className="hero-3d-scene" />
```

## Blender export

1. Apply transforms in Blender (`Ctrl+A` → Rotation & Scale).
2. Use glTF 2.0 export.
3. Format: **GLB**, unless separate textures are required.
4. Enable compression where appropriate; keep the model's origin centered.
5. Place the exported file at `public/models/<name>.glb`.
6. Reference it from the browser as `/models/<name>.glb`.

HDRI files can be placed in `public/hdri/` and passed to a future Drei `Environment` configuration when a custom lighting setup is needed.
