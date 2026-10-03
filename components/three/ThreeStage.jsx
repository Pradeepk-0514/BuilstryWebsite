"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";

function GLTFModel({ src, ...props }) {
  const group = useRef(null);
  const { scene } = useGLTF(src);

  useEffect(() => {
    if (!group.current) return undefined;
    const tween = gsap.to(group.current.rotation, {
      y: Math.PI * 2,
      duration: 18,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  return <primitive ref={group} object={scene} {...props} />;
}

export default function ThreeStage({ model, children, className = "", camera = { position: [0, 0, 5], fov: 35 } }) {
  return (
    <div className={`three-stage ${className}`}>
      <Canvas camera={camera} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          {model ? <GLTFModel src={model} /> : null}
          {children}
          <Environment preset="city" environmentIntensity={0.7} />
          <EffectComposer>
            <Bloom intensity={0.35} luminanceThreshold={0.65} mipmapBlur />
          </EffectComposer>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export { GLTFModel };
