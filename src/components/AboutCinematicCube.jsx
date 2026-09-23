import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "./AboutCinematicCube.css";

const COLORS = { midnight: "#141D26", navy: "#243447", ice: "#F7F8FA", magenta: "#C51F5D" };
const AXIS = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
const MOVES = [
  { axis: "y", layer: 1, dir: 1 }, { axis: "x", layer: -1, dir: -1 },
  { axis: "z", layer: 1, dir: 1 }, { axis: "y", layer: -1, dir: -1 },
];

function rotatePosition(pos, axis, dir) {
  const { x, y, z } = pos;
  if (axis === "x") return dir > 0 ? { x, y: -z, z: y } : { x, y: z, z: -y };
  if (axis === "y") return dir > 0 ? { x: z, y, z: -x } : { x: -z, y, z: x };
  return dir > 0 ? { x: -y, y: x, z } : { x: y, y: -x, z };
}

function makeCubies() {
  const result = [];
  let id = 0;
  for (let x = -1; x <= 1; x += 1) for (let y = -1; y <= 1; y += 1) for (let z = -1; z <= 1; z += 1) {
    result.push({ id: id++, pos: { x, y, z }, home: { x, y, z }, quat: new THREE.Quaternion() });
  }
  return result;
}

function applyMove(cubies, move) {
  const rotation = new THREE.Quaternion().setFromAxisAngle(AXIS[move.axis], move.dir * Math.PI / 2);
  return cubies.map((cubie) => cubie.pos[move.axis] !== move.layer ? cubie : ({
    ...cubie,
    pos: rotatePosition(cubie.pos, move.axis, move.dir),
    quat: rotation.clone().multiply(cubie.quat),
  }));
}

function colourFor(home, face) {
  if (face === 0) return home.x === 1 ? COLORS.magenta : COLORS.midnight;
  if (face === 1) return home.x === -1 ? COLORS.navy : COLORS.midnight;
  if (face === 2) return home.y === 1 ? COLORS.ice : COLORS.midnight;
  if (face === 3) return home.y === -1 ? COLORS.navy : COLORS.midnight;
  if (face === 4) return home.z === 1 ? COLORS.ice : COLORS.midnight;
  return home.z === -1 ? COLORS.magenta : COLORS.midnight;
}

function CinematicCubie({ cubie, move, onDown, onMove, onUp }) {
  const isMoving = move && cubie.pos[move.axis] === move.layer;
  const eased = move?.progress == null ? 0 : move.progress * move.progress * (3 - 2 * move.progress);
  const rotation = isMoving ? new THREE.Quaternion().setFromAxisAngle(AXIS[move.axis], move.dir * eased * Math.PI / 2).multiply(cubie.quat) : cubie.quat;
  const materials = useMemo(() => Array.from({ length: 6 }, (_, face) => {
    const color = colourFor(cubie.home, face);
    return new THREE.MeshStandardMaterial({ color, roughness: .3, metalness: .18, emissive: color === COLORS.magenta ? COLORS.magenta : COLORS.midnight, emissiveIntensity: color === COLORS.magenta ? .22 : .025 });
  }), [cubie.home.x, cubie.home.y, cubie.home.z]);
  const accent = (cubie.id * 17) % 5 === 0;
  return <mesh
    position={[cubie.pos.x * 1.12 + (accent ? .035 : 0), cubie.pos.y * 1.12, cubie.pos.z * 1.12]}
    quaternion={rotation}
    scale={accent ? 1.035 : 1}
    castShadow
    receiveShadow
    onPointerDown={(event) => onDown(event, cubie)}
    onPointerMove={(event) => onMove(event, cubie)}
    onPointerUp={onUp}
    onPointerCancel={onUp}
  >
    <boxGeometry args={[1, 1, 1]} />
    {materials.map((material, index) => <primitive object={material} attach={`material-${index}`} key={index} />)}
  </mesh>;
}

function OrbitLines() {
  return <>
    <mesh rotation={[1.08, .34, -.18]} position={[0, 0, -.3]}><torusGeometry args={[3.35, .008, 8, 180]} /><meshBasicMaterial color={COLORS.magenta} transparent opacity={.33} /></mesh>
    <mesh rotation={[1.6, -.42, .42]} position={[0, 0, -.25]}><torusGeometry args={[2.75, .006, 8, 180]} /><meshBasicMaterial color={COLORS.ice} transparent opacity={.15} /></mesh>
    <Sparkles count={22} scale={[6.8, 4.6, 5.4]} size={1.8} speed={.16} color={COLORS.magenta} opacity={.52} />
  </>;
}

function CinematicScene() {
  const [cubies, setCubies] = useState(() => MOVES.reduce(applyMove, makeCubies()));
  const [move, setMove] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: -.16, y: .48 });
  const group = useRef(null);
  const drag = useRef(null);
  const orbit = useRef(null);
  const progress = useRef(0);
  const idle = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useFrame((_, delta) => {
    if (move?.snapping) {
      progress.current = Math.min(1, progress.current + delta * 5.2);
      setMove((current) => current ? { ...current, progress: progress.current } : current);
      if (progress.current >= 1) {
        setCubies((current) => applyMove(current, move));
        setMove(null);
        progress.current = 0;
      }
    }
    if (group.current && !drag.current && !orbit.current && !move) {
      idle.current += delta;
      const targetX = rotation.x + pointer.current.y * .045 + Math.sin(idle.current * .22) * .022;
      const targetY = rotation.y + pointer.current.x * .06 + Math.sin(idle.current * .17) * .028;
      group.current.rotation.x += (targetX - group.current.rotation.x) * .06;
      group.current.rotation.y += (targetY - group.current.rotation.y) * .06;
    }
  });

  const down = (event, cubie) => {
    event.stopPropagation();
    if (move || orbit.current) return;
    const normal = event.face?.normal?.clone().normalize() || AXIS.y;
    const axis = ["x", "y", "z"][normal.toArray().map(Math.abs).indexOf(1)] || "y";
    drag.current = { axis, layer: cubie.pos[axis], x: event.clientX, y: event.clientY, angle: 0 };
    setHovered(true);
    event.target.setPointerCapture?.(event.pointerId);
  };

  const dragLayer = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    const angle = drag.current.axis === "x" ? -dy * .011 : dx * .011;
    drag.current.angle = THREE.MathUtils.clamp(angle, -Math.PI / 2, Math.PI / 2);
    setMove({ axis: drag.current.axis, layer: drag.current.layer, dir: angle < 0 ? -1 : 1, progress: Math.abs(drag.current.angle) / (Math.PI / 2) });
  };

  const endLayer = (event) => {
    if (!drag.current) return;
    const current = drag.current;
    drag.current = null;
    event.target.releasePointerCapture?.(event.pointerId);
    if (Math.abs(current.angle) < .16) return setMove(null);
    progress.current = Math.abs(current.angle) / (Math.PI / 2);
    setMove({ axis: current.axis, layer: current.layer, dir: current.angle < 0 ? -1 : 1, progress: progress.current, snapping: true });
  };

  const downOrbit = (event) => {
    if (drag.current || move || (event.button !== undefined && event.button !== 0)) return;
    orbit.current = { x: event.clientX, y: event.clientY };
    setHovered(true);
    event.target.setPointerCapture?.(event.pointerId);
  };

  const moveOrbit = (event) => {
    pointer.current = { x: THREE.MathUtils.clamp((event.pointer.x || 0), -1, 1), y: THREE.MathUtils.clamp((event.pointer.y || 0), -1, 1) };
    if (!orbit.current) return;
    const dx = event.clientX - orbit.current.x;
    const dy = event.clientY - orbit.current.y;
    orbit.current = { x: event.clientX, y: event.clientY };
    setRotation((current) => ({ x: THREE.MathUtils.clamp(current.x + dy * .008, -1.1, 1.1), y: current.y + dx * .008 }));
  };

  const endOrbit = (event) => {
    if (!orbit.current) return;
    orbit.current = null;
    event.target.releasePointerCapture?.(event.pointerId);
  };

  useEffect(() => { gl.domElement.style.cursor = move ? "grabbing" : hovered ? "grab" : "default"; return () => { gl.domElement.style.cursor = "default"; }; }, [gl, move, hovered]);

  return <>
    <ambientLight intensity={1.05} color={COLORS.ice} />
    <directionalLight position={[5, 6, 7]} intensity={4.2} color={COLORS.ice} castShadow shadow-mapSize={[512, 512]} />
    <pointLight position={[-3, 1, 3]} intensity={15} distance={8} color={COLORS.magenta} />
    <pointLight position={[3, -2, 4]} intensity={4} distance={7} color={COLORS.ice} />
    <OrbitLines />
    <group ref={group} rotation={[rotation.x, rotation.y, 0]}>
      {cubies.map((cubie) => <CinematicCubie key={cubie.id} cubie={cubie} move={move} onDown={down} onMove={dragLayer} onUp={endLayer} />)}
    </group>
    <mesh position={[0, 0, -2.4]} onPointerDown={downOrbit} onPointerMove={moveOrbit} onPointerUp={endOrbit} onPointerCancel={endOrbit} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <planeGeometry args={[10, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  </>;
}

export default function AboutCinematicCube() {
  return <div className="about-cinematic-cube" aria-label="Interactive Builstry modular cube">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [4.8, 3.3, 6.7], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <CinematicScene />
    </Canvas>
    <span className="about-cube-hint">DRAG TO REARRANGE</span>
  </div>;
}
