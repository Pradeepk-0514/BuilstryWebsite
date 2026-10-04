"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Sparkles, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { getJourneyLayout, milestones } from "./journeyData";

const GLB_URL = "/assets/journey/builstry-journey.glb";
const HDR_URL = "/assets/journey/builstry-studio.hdr";

function stopReveal(progress, index, reducedMotion) {
  if (reducedMotion) return 1;
  const stop = index / (milestones.length - 1);
  const start = index === 0 ? -0.16 : Math.max(0, stop - 0.22);
  const linear = THREE.MathUtils.clamp((progress - start) / 0.13, 0, 1);
  return linear * linear * (3 - 2 * linear);
}

function createJourneyCurve(points, z = 0) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y - 0.16, z)),
    false,
    "catmullrom",
    0.38,
  );
}

function setCameraFocus(route, progress, layout, viewportWidth, target) {
  route.getPointAt(THREE.MathUtils.clamp(progress, 0, 1), target);
  if (layout === "desktop") target.x += (viewportWidth <= 1200 ? 1.05 : 3.25) * (1 - progress);
  else if (layout === "wide") target.x += 5.7 * (1 - progress);
  if (layout !== "mobile") target.y += layout === "wide" ? 1.65 : 1.55;
  return target;
}

function CameraFit({ layout, progressRef, reducedMotion }) {
  const { camera, size } = useThree();
  const route = useMemo(() => createJourneyCurve(milestones.map((item) => item[layout])), [layout]);
  const focus = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const initial = reducedMotion ? focus.set(0, 0, 0) : setCameraFocus(route, progressRef.current, layout, size.width, focus);
    camera.position.set(initial.x, initial.y + 5.9, 28);
    camera.lookAt(initial.x, initial.y, 0);
    camera.zoom = layout === "mobile" ? 76 : layout === "wide" ? 88 : 94;
    camera.updateProjectionMatrix();
  }, [camera, focus, layout, progressRef, reducedMotion, route, size.width]);

  useFrame((_, delta) => {
    const progress = reducedMotion ? 0 : THREE.MathUtils.clamp(progressRef.current || 0, 0, 1);
    if (reducedMotion) focus.set(0, 0, 0);
    else setCameraFocus(route, progress, layout, size.width, focus);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, focus.x, 4.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, focus.y + 5.9, 4.6, delta);
    camera.lookAt(camera.position.x, camera.position.y - 5.9, 0);
  });

  return null;
}

function createTrail(points) {
  const curve = createJourneyCurve(points, -0.48);
  const stations = curve.getSpacedPoints(260);
  const vertices = [];
  const colors = [];
  const indices = [];
  const start = new THREE.Color("#D83C91");
  const middle = new THREE.Color("#B19BEA");
  const end = new THREE.Color("#F09BCB");

  stations.forEach((point, index) => {
    const t = index / (stations.length - 1);
    const tangent = curve.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    const width = 0.18 + Math.sin(t * Math.PI) * 0.08;
    const color = t < 0.55
      ? start.clone().lerp(middle, t / 0.55)
      : middle.clone().lerp(end, (t - 0.55) / 0.45);

    for (const side of [-1, 1]) {
      vertices.push(point.x + normal.x * width * side, point.y + normal.y * width * side, point.z + 0.012);
      colors.push(color.r, color.g, color.b);
    }
    if (index < stations.length - 1) {
      const base = index * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  });

  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  ribbon.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  ribbon.setIndex(indices);
  ribbon.computeVertexNormals();
  return {
    ribbon,
    core: new THREE.TubeGeometry(curve, 260, 0.028, 8, false),
    highlight: new THREE.TubeGeometry(curve, 260, 0.008, 6, false),
  };
}

function JourneyTrajectory({ layout, progressRef, reducedMotion }) {
  const positions = useMemo(() => milestones.map((item) => item[layout]), [layout]);
  const geometry = useMemo(() => createTrail(positions), [positions]);
  useEffect(() => () => {
    geometry.ribbon.dispose();
    geometry.core.dispose();
    geometry.highlight.dispose();
  }, [geometry]);

  useFrame(() => {
    const progress = reducedMotion ? 1 : THREE.MathUtils.clamp(progressRef.current || 0, 0, 1);
    [geometry.ribbon, geometry.core, geometry.highlight].forEach((item) => {
      const count = item.index?.count ?? item.getAttribute("position").count;
      item.setDrawRange(0, Math.floor((count * progress) / 3) * 3);
    });
  });

  return (
    <group>
      <mesh geometry={geometry.ribbon} renderOrder={1}>
        <meshBasicMaterial vertexColors transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry.core} renderOrder={2}>
        <meshStandardMaterial
          color="#C77AD2"
          emissive="#D65AAB"
          emissiveIntensity={0.66}
          roughness={0.3}
          metalness={0.28}
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry.highlight} renderOrder={3}>
        <meshBasicMaterial color="#FFF8FF" transparent opacity={0.76} depthWrite={false} />
      </mesh>
    </group>
  );
}

function JourneyAssets({ layout, activeIndex, progressRef, reducedMotion }) {
  const { scene: source } = useGLTF(GLB_URL);
  const scene = useMemo(() => source.clone(true), [source]);
  const anchors = useMemo(() => milestones.map((item) => scene.getObjectByName(item.anchor)), [scene]);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetScale = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    scene.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material) => {
        if (material && "envMapIntensity" in material) material.envMapIntensity = 0.72;
      });
    });
  }, [scene]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const responsiveScale = layout === "mobile" ? 0.76 : layout === "desktop" ? 0.92 : 1;
    const progress = reducedMotion ? 1 : THREE.MathUtils.clamp(progressRef.current || 0, 0, 1);
    anchors.forEach((node, index) => {
      if (!node) return;
      const [x, y, z] = milestones[index][layout];
      const reveal = stopReveal(progress, index, reducedMotion);
      node.visible = reveal > 0.001;
      const drift = reducedMotion ? 0 : Math.sin(elapsed * 0.52 + index * 0.9) * 0.025;
      targetPosition.set(x, y + drift, z);
      node.position.lerp(targetPosition, 1 - Math.exp(-delta * 5.5));
      targetScale.setScalar(Math.max(0.0001, responsiveScale * reveal * (activeIndex === index ? 1.065 : 1)));
      node.scale.lerp(targetScale, 1 - Math.exp(-delta * 7));
      if (!reducedMotion) {
        node.rotation.y = index === 4 ? elapsed * 0.12 : Math.sin(elapsed * 0.42 + index * 0.82) * 0.035;
        node.rotation.z = Math.sin(elapsed * 0.56 + index * 0.71) * 0.012;
      }
    });
  });

  return <primitive object={scene} dispose={null} />;
}

function MilestoneSign({ item, index, activeIndex, setActiveIndex, layout, reducedMotion, signRef, buttonRef, signWidth }) {
  const width = signWidth;
  return (
    <group ref={signRef}>
      <Html transform distanceFactor={layout === "mobile" ? 5.25 : 4.5} position={[layout === "mobile" ? 0 : -0.82, layout === "mobile" ? 1.45 : 1.65, 1.12]} zIndexRange={[16, 0]} style={{ pointerEvents: "auto" }}>
        <button
          ref={buttonRef}
          type="button"
          className={`journey3d-sign${activeIndex === index ? " is-active" : ""}${reducedMotion ? " is-still" : ""}`}
          style={{ "--sign-width": `${width}px` }}
          tabIndex={index === 0 || reducedMotion ? 0 : -1}
          aria-hidden={index === 0 || reducedMotion ? undefined : "true"}
          aria-pressed={activeIndex === index}
          aria-label={`${item.year}: ${item.title}. ${item.description}`}
          onPointerEnter={() => setActiveIndex(index)}
          onPointerLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex(index)}
          onBlur={() => setActiveIndex(null)}
          onClick={() => setActiveIndex(index)}
        >
          <span className="journey3d-sign-icon" aria-hidden="true"><i>{String(index + 1).padStart(2, "0")}</i></span>
          <span className="journey3d-sign-year">{item.year}</span>
          <strong>{item.title}</strong>
          <span className="journey3d-sign-description">{item.description}</span>
          <span className="journey3d-sign-phase"><i />{item.phase}</span>
        </button>
      </Html>
    </group>
  );
}

function MilestoneSignLayer({ layout, activeIndex, setActiveIndex, progressRef, reducedMotion }) {
  const { camera, size } = useThree();
  const signRefs = useRef([]);
  const buttonRefs = useRef([]);
  const editorialRef = useRef(null);
  const signOffset = useMemo(() => new THREE.Vector3(), []);
  const safeLanePoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    editorialRef.current = document.querySelector(".journey3d-editorial");
  }, []);

  const mobileSignWidth = Math.min(138, Math.max(120, Math.round(size.width * 0.35)));
  const signWidth = layout === "mobile" ? mobileSignWidth : layout === "desktop" ? 148 : 156;

  useFrame((_, delta) => {
    const progress = reducedMotion ? 1 : THREE.MathUtils.clamp(progressRef.current || 0, 0, 1);
    milestones.forEach((item, index) => {
      const sign = signRefs.current[index];
      if (!sign) return;
      const [x, y, z] = item[layout];
      const isSummit = index === milestones.length - 1;
      const offsetY = layout === "mobile"
        ? (isSummit ? (reducedMotion ? -0.78 : 0.55) : -1.2)
        : (isSummit ? -0.63 : 0);

      if (layout === "mobile") {
        const left = isSummit
          ? Math.max(12, Math.min((editorialRef.current?.getBoundingClientRect().right ?? size.width * 0.48) + 10, size.width - signWidth - 12))
          : index % 2 === 0 ? 12 : size.width - signWidth - 12;
        const centerNdcX = ((left + signWidth / 2) / size.width) * 2 - 1;
        camera.updateMatrixWorld();
        safeLanePoint.set(centerNdcX, 0, 0.5).unproject(camera);
        signOffset.set(safeLanePoint.x, y + offsetY, z);
      } else {
        signOffset.set(x, y + offsetY, z);
      }
      sign.position.lerp(signOffset, 1 - Math.exp(-delta * 5.5));
      const reveal = stopReveal(progress, index, reducedMotion);
      sign.scale.setScalar(Math.max(0.0001, reveal));
      const button = buttonRefs.current[index];
      const isRevealed = reducedMotion || reveal > 0.08;
      if (button && button.tabIndex !== (isRevealed ? 0 : -1)) {
        button.tabIndex = isRevealed ? 0 : -1;
        if (isRevealed) button.removeAttribute("aria-hidden");
        else button.setAttribute("aria-hidden", "true");
      }
    });
  });

  return (
    <group>
      {milestones.map((item, index) => (
        <MilestoneSign
          key={item.id}
          item={item}
          index={index}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          layout={layout}
          reducedMotion={reducedMotion}
          signWidth={signWidth}
          signRef={(node) => { signRefs.current[index] = node; }}
          buttonRef={(node) => { buttonRefs.current[index] = node; }}
        />
      ))}
    </group>
  );
}

function LightSpecks({ reducedMotion }) {
  return (
    <>
      <Sparkles count={28} scale={[17, 8.4, 3.8]} size={2.2} speed={reducedMotion ? 0 : 0.18} opacity={0.3} color="#E677B7" noise={0.38} />
      <Sparkles count={15} scale={[13, 6.7, 2.8]} size={3.1} speed={reducedMotion ? 0 : 0.12} opacity={0.2} color="#A897E8" noise={0.55} />
    </>
  );
}

function SceneMotionRig({ children, progressRef, reducedMotion }) {
  const rig = useRef(null);
  useFrame((state, delta) => {
    if (reducedMotion || !rig.current) return;
    const scroll = progressRef.current || 0;
    const targetY = state.pointer.x * 0.012 + (scroll - 0.5) * 0.01;
    const targetX = -state.pointer.y * 0.008;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 3.2, delta);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 3.2, delta);
    rig.current.position.y = THREE.MathUtils.damp(
      rig.current.position.y,
      Math.sin(state.clock.elapsedTime * 0.35) * 0.025 + Math.sin(scroll * Math.PI) * 0.055,
      3,
      delta,
    );
  });
  return <group ref={rig}>{children}</group>;
}

function SceneContent({ layout, activeIndex, setActiveIndex, progressRef, reducedMotion }) {
  return (
    <>
      <CameraFit layout={layout} progressRef={progressRef} reducedMotion={reducedMotion} />
      <fog attach="fog" args={["#F7FAFD", 20, 42]} />
      <ambientLight intensity={1.3} color="#F4F2FF" />
      <hemisphereLight intensity={0.95} color="#FFF7FD" groundColor="#9B8DBA" />
      <directionalLight
        position={[-7, 9, 11]}
        intensity={2.0}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00018}
      />
      <directionalLight position={[10, 4, -4]} intensity={0.9} color="#D6C8FF" />
      <pointLight position={[1, -1, 8]} intensity={18} distance={15} color="#ED77BE" />
      <pointLight position={[-5, 3, -2]} intensity={13} distance={14} color="#A899E8" />
      <Suspense fallback={null}>
        <Environment files={HDR_URL} background={false} environmentIntensity={0.82} resolution={256} />
        <SceneMotionRig progressRef={progressRef} reducedMotion={reducedMotion}>
          <JourneyTrajectory layout={layout} progressRef={progressRef} reducedMotion={reducedMotion} />
          <JourneyAssets layout={layout} activeIndex={activeIndex} progressRef={progressRef} reducedMotion={reducedMotion} />
          <LightSpecks reducedMotion={reducedMotion} />
        </SceneMotionRig>
        <MilestoneSignLayer
          layout={layout}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.4} luminanceThreshold={0.75} luminanceSmoothing={0.58} mipmapBlur />
        <Vignette eskil={false} offset={0.34} darkness={0.1} />
      </EffectComposer>
    </>
  );
}

function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window === "undefined" ? 1280 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  }));
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

export default function JourneyScene({ activeIndex, setActiveIndex, progressRef, reducedMotion }) {
  const { width, height } = useViewportSize();
  const layout = getJourneyLayout(width / Math.max(height, 1));
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 5.9, 28], zoom: 94, near: 0.1, far: 100 }}
      aria-label="Interactive 3D Builstry journey from 2018 to 2024 and beyond"
      role="region"
      fallback={<div className="journey3d-canvas-fallback">Builstry — Find. Think. Build.</div>}
    >
      <SceneContent
        layout={layout}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}

useGLTF.preload(GLB_URL);
