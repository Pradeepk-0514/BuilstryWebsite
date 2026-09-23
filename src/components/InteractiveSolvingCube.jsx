import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, RoundedBoxGeometry, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "./InteractiveSolvingCube.css";

const COLORS = {
  navy: "#182a3c",
  navyDeep: "#0e1a28",
  ice: "#f5f6f3",
  magenta: "#c51f5d",
  pink: "#f34c91",
};

const AXES = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
const SCRAMBLE = [
  { axis: "y", layer: 1, dir: 1 },
  { axis: "x", layer: -1, dir: -1 },
  { axis: "z", layer: 1, dir: 1 },
  { axis: "y", layer: -1, dir: -1 },
  { axis: "x", layer: 1, dir: 1 },
  { axis: "z", layer: -1, dir: -1 },
];

const FACE_MATERIALS = {
  right: COLORS.magenta,
  left: COLORS.navy,
  top: COLORS.ice,
  bottom: COLORS.navyDeep,
  front: COLORS.ice,
  back: COLORS.magenta,
  inner: COLORS.navyDeep,
};

function createCubies() {
  const cubies = [];
  let id = 0;
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        cubies.push({ id: id++, pos: { x, y, z }, home: { x, y, z }, quat: new THREE.Quaternion() });
      }
    }
  }
  return cubies;
}

function rotatePosition(pos, axis, dir) {
  const { x, y, z } = pos;
  if (axis === "x") return dir > 0 ? { x, y: -z, z: y } : { x, y: z, z: -y };
  if (axis === "y") return dir > 0 ? { x: z, y, z: -x } : { x: -z, y, z: x };
  return dir > 0 ? { x: -y, y: x, z } : { x: y, y: -x, z };
}

function applyMove(cubies, move) {
  const rotation = new THREE.Quaternion().setFromAxisAngle(AXES[move.axis], move.dir * Math.PI / 2);
  return cubies.map((cubie) => {
    if (cubie.pos[move.axis] !== move.layer) return cubie;
    return {
      ...cubie,
      pos: rotatePosition(cubie.pos, move.axis, move.dir),
      quat: rotation.clone().multiply(cubie.quat),
    };
  });
}

function initialCubies() {
  return SCRAMBLE.reduce(applyMove, createCubies());
}

function faceColor(x, y, z, index) {
  if (index === 0) return x === 1 ? FACE_MATERIALS.right : FACE_MATERIALS.inner;
  if (index === 1) return x === -1 ? FACE_MATERIALS.left : FACE_MATERIALS.inner;
  if (index === 2) return y === 1 ? FACE_MATERIALS.top : FACE_MATERIALS.inner;
  if (index === 3) return y === -1 ? FACE_MATERIALS.bottom : FACE_MATERIALS.inner;
  if (index === 4) return z === 1 ? FACE_MATERIALS.front : FACE_MATERIALS.inner;
  return z === -1 ? FACE_MATERIALS.back : FACE_MATERIALS.inner;
}

function Cubie({ cubie, activeMove, onPointerDown, onPointerMove, onPointerUp, onPointerOver, onPointerOut }) {
  const active = activeMove && cubie.pos[activeMove.axis] === activeMove.layer;
  const smoothProgress = activeMove?.auto || activeMove?.snapping
    ? activeMove.progress * activeMove.progress * (3 - 2 * activeMove.progress)
    : activeMove?.progress;
  const localRotation = active ? new THREE.Quaternion().setFromAxisAngle(AXES[activeMove.axis], activeMove.dir * smoothProgress * Math.PI / 2).multiply(cubie.quat) : cubie.quat;
  const materials = useMemo(() => Array.from({ length: 6 }, (_, index) => new THREE.MeshPhysicalMaterial({
    color: faceColor(cubie.home.x, cubie.home.y, cubie.home.z, index),
    roughness: .2,
    metalness: .2,
    clearcoat: .34,
    clearcoatRoughness: .16,
    envMapIntensity: 1.15,
    emissive: faceColor(cubie.home.x, cubie.home.y, cubie.home.z, index) === COLORS.magenta ? COLORS.magenta : COLORS.navyDeep,
    emissiveIntensity: faceColor(cubie.home.x, cubie.home.y, cubie.home.z, index) === COLORS.magenta ? .11 : .018,
  })), [cubie.home.x, cubie.home.y, cubie.home.z]);

  return (
    <mesh
      position={[cubie.pos.x * 1.03, cubie.pos.y * 1.03, cubie.pos.z * 1.03]}
      quaternion={localRotation}
      castShadow
      receiveShadow
      onPointerDown={(event) => onPointerDown(event, cubie)}
      onPointerMove={(event) => onPointerMove(event, cubie)}
      onPointerUp={(event) => onPointerUp(event, cubie)}
      onPointerCancel={(event) => onPointerUp(event, cubie)}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <RoundedBoxGeometry args={[.96, .96, .96]} radius={.075} smoothness={4} bevelSegments={3} />
      {materials.map((material, index) => <primitive object={material} attach={`material-${index}`} key={index} />)}
      <Edges scale={1.005} threshold={18} color={cubie.home.x === 1 || cubie.home.y === 1 || cubie.home.z === 1 ? COLORS.ice : COLORS.navy} linewidth={.65} />
    </mesh>
  );
}

function OrbitalDetails() {
  return (
    <>
      <mesh rotation={[Math.PI / 2.2, .25, .1]} position={[0, 0, -.2]}>
        <torusGeometry args={[2.7, .008, 8, 160]} />
        <meshBasicMaterial color={COLORS.magenta} transparent opacity={.26} />
      </mesh>
      <mesh rotation={[1.1, -.35, .4]} position={[0, 0, -.15]}>
        <torusGeometry args={[2.25, .006, 8, 160]} />
        <meshBasicMaterial color={COLORS.navy} transparent opacity={.22} />
      </mesh>
      <Sparkles count={30} scale={[5.8, 4.4, 4.8]} size={2.2} speed={.18} color={COLORS.magenta} opacity={.6} />
    </>
  );
}

function CubeScene({ onReady }) {
  const [cubies, setCubies] = useState(initialCubies);
  const [activeMove, setActiveMove] = useState(null);
  const [solveQueue, setSolveQueue] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [cubeRotation, setCubeRotation] = useState({ x: -.2, y: .5 });
  const outerRef = useRef();
  const dragRef = useRef(null);
  const orbitDragRef = useRef(null);
  const idleRef = useRef(0);
  const progressRef = useRef(0);
  const historyRef = useRef(SCRAMBLE.slice());
  const { gl } = useThree();

  useEffect(() => {
    if (solveQueue.length && !activeMove && !dragRef.current) {
      const [move, ...rest] = solveQueue;
      setSolveQueue(rest);
      progressRef.current = 0;
      setActiveMove({ ...move, progress: 0, auto: true });
    }
  }, [solveQueue, activeMove]);

  useFrame((_, delta) => {
    if (activeMove?.auto || activeMove?.snapping) {
      progressRef.current = Math.min(1, progressRef.current + delta * (activeMove.auto ? 2.15 : 5.8));
      setActiveMove((current) => current ? { ...current, progress: progressRef.current } : current);
      if (progressRef.current >= 1) {
        setCubies((current) => applyMove(current, activeMove));
        if (activeMove.auto) historyRef.current = historyRef.current.slice(0, -1);
        if (activeMove.snapping) historyRef.current.push({ axis: activeMove.axis, layer: activeMove.layer, dir: activeMove.dir });
        setActiveMove(null);
        progressRef.current = 0;
      }
    }
    if (outerRef.current && !dragRef.current && !orbitDragRef.current && !activeMove) {
      idleRef.current += delta;
      outerRef.current.rotation.y = cubeRotation.y + Math.sin(idleRef.current * .28) * .035;
      outerRef.current.rotation.x = cubeRotation.x + Math.sin(idleRef.current * .37) * .018;
    }
  });

  const beginLayerDrag = (event, cubie) => {
    event.stopPropagation();
    if (activeMove) return;
    const normal = event.face?.normal?.clone().normalize() || new THREE.Vector3(0, 1, 0);
    const axis = ["x", "y", "z"][normal.toArray().map(Math.abs).indexOf(1)] || "y";
    dragRef.current = { axis, layer: cubie.pos[axis], startX: event.clientX, startY: event.clientY, lastAngle: 0 };
    setHovered(true);
    event.target.setPointerCapture?.(event.pointerId);
  };

  const moveLayerDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const angle = drag.axis === "x" ? -dy * .012 : drag.axis === "y" ? dx * .012 : dx * .012;
    drag.lastAngle = THREE.MathUtils.clamp(angle, -Math.PI / 2, Math.PI / 2);
    setActiveMove({ axis: drag.axis, layer: drag.layer, dir: drag.lastAngle < 0 ? -1 : 1, progress: Math.abs(drag.lastAngle) / (Math.PI / 2) });
  };

  const endLayerDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const angle = drag.lastAngle;
    dragRef.current = null;
    event.target.releasePointerCapture?.(event.pointerId);
    if (Math.abs(angle) < .18) {
      setActiveMove(null);
      return;
    }
    const dir = angle < 0 ? -1 : 1;
    progressRef.current = Math.abs(angle) / (Math.PI / 2);
    setActiveMove({ axis: drag.axis, layer: drag.layer, dir, progress: progressRef.current, snapping: true });
  };

  const beginOrbitDrag = (event) => {
    if (dragRef.current || activeMove || (event.button !== undefined && event.button !== 0)) return;
    orbitDragRef.current = { x: event.clientX, y: event.clientY };
    setHovered(true);
    event.target.setPointerCapture?.(event.pointerId);
  };

  const moveOrbitDrag = (event) => {
    if (!orbitDragRef.current || dragRef.current) return;
    const previous = orbitDragRef.current;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    orbitDragRef.current = { x: event.clientX, y: event.clientY };
    setCubeRotation((current) => ({ x: THREE.MathUtils.clamp(current.x + dy * .008, -1.15, 1.15), y: current.y + dx * .008 }));
  };

  const endOrbitDrag = (event) => {
    if (!orbitDragRef.current) return;
    orbitDragRef.current = null;
    event.target.releasePointerCapture?.(event.pointerId);
  };

  const solve = () => {
    if (activeMove || solveQueue.length) return;
    setSolveQueue(historyRef.current.slice().reverse().map((move) => ({ ...move, dir: -move.dir })));
  };

  useEffect(() => { onReady?.({ solve, reset: () => { historyRef.current = SCRAMBLE.slice(); setCubies(initialCubies()); } }); }, [onReady, activeMove, solveQueue.length]);

  return (
    <>
      <ambientLight intensity={1.15} color={COLORS.ice} />
      <hemisphereLight intensity={1.15} color={COLORS.ice} groundColor={COLORS.navyDeep} />
      <directionalLight position={[4, 7, 8]} intensity={5.2} color={COLORS.ice} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      <spotLight position={[-4, 4, 5]} intensity={28} distance={10} angle={.42} penumbra={.75} color={COLORS.magenta} />
      <pointLight position={[3, -2, 4]} intensity={4.5} distance={7} color="#8ca4bd" />
      <OrbitalDetails />
      <Float speed={1.05} rotationIntensity={.08} floatIntensity={.12} enabled={!hovered && !activeMove}>
        <group ref={outerRef} rotation={[cubeRotation.x, cubeRotation.y, 0]}>
          {cubies.map((cubie) => <Cubie key={cubie.id} cubie={cubie} activeMove={activeMove} onPointerDown={beginLayerDrag} onPointerMove={moveLayerDrag} onPointerUp={endLayerDrag} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} />)}
        </group>
      </Float>
      <mesh position={[0, 0, -2.2]} onPointerDown={beginOrbitDrag} onPointerMove={moveOrbitDrag} onPointerUp={endOrbitDrag} onPointerCancel={endOrbitDrag} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <planeGeometry args={[9, 7]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <CubeHud solving={Boolean(activeMove?.auto || solveQueue.length)} />
    </>
  );
}

function CubeHud({ solving }) {
  const { gl } = useThree();
  useEffect(() => { gl.domElement.style.cursor = solving ? "wait" : "grab"; return () => { gl.domElement.style.cursor = "default"; }; }, [gl, solving]);
  return null;
}

export default function InteractiveSolvingCube() {
  const [solving, setSolving] = useState(false);
  const sceneApi = useRef(null);
  const solve = () => {
    if (sceneApi.current?.solve) {
      sceneApi.current.solve();
      setSolving(true);
      window.setTimeout(() => setSolving(false), 3600);
    }
  };
  const handleReady = (api) => { sceneApi.current = api; };
  return (
    <div className="interactive-cube-shell">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.8, 3.6, 6.8], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <CubeScene onReady={handleReady} />
      </Canvas>
      <div className="interactive-cube-caption">
        <span>COMPLEXITY / REARRANGEMENT / SOLUTION</span>
        <button type="button" onClick={solve} disabled={solving}>{solving ? "RESTORING…" : "RESTORE ORDER"}<b>→</b></button>
      </div>
      <div className="interactive-cube-cursor-hint">DRAG A LAYER TO REARRANGE</div>
    </div>
  );
}

export { CubeScene };
