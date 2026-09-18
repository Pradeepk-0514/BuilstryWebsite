import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";


const COLORS = {
  ice: "#F7F8FA",
  navy: "#243447",
  midnight: "#141D26",
  magenta: "#C51F5D",
};

/* ======================================================
   UTILITIES
====================================================== */

function smoothStep(t) {
  return t * t * (3 - 2 * t);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

/* ======================================================
   CINEMATIC CUBE
====================================================== */

function SystemCube({
  position,
  size,
  color,
  accent = false,
  delay = 0,
  index = 0,
}) {
  const group = useRef();
  const cube = useRef();
  const inner = useRef();
  const aura1 = useRef();
  const aura2 = useRef();

  const target = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state, delta) => {
    if (!group.current || !cube.current) return;

    const time = state.clock.getElapsedTime();

    /*
    ====================================================
    CINEMATIC ASSEMBLY
    ====================================================
    */

    const introDuration = 2.4;

    const localTime = time - delay * 0.12;

    const progress = clamp01(localTime / introDuration);

    const eased = smoothStep(progress);

    /*
    Start slightly outside final position.
    */

    const startX = target.x + (index % 2 === 0 ? -0.65 : 0.65);

    const startY = target.y + (index % 3 === 0 ? 0.5 : -0.45);

    const startZ = target.z - 1.5;

    /*
    Move into final position.
    */

    const desiredX = THREE.MathUtils.lerp(startX, target.x, eased);

    const desiredY = THREE.MathUtils.lerp(startY, target.y, eased);

    const desiredZ = THREE.MathUtils.lerp(startZ, target.z, eased);

    /*
    Small cinematic overshoot.
    */

    const overshoot =
      progress > 0.72
        ? Math.sin(((progress - 0.72) / 0.28) * Math.PI) * 0.035
        : 0;

    group.current.position.x = desiredX;

    group.current.position.y = desiredY + overshoot;

    group.current.position.z = desiredZ;

    /*
    ====================================================
    SCALE-IN
    ====================================================
    */

    const scaleIn = THREE.MathUtils.lerp(0.25, 1, eased);

    cube.current.scale.setScalar(scaleIn);

    /*
    ====================================================
    SLOW CINEMATIC ROTATION
    ====================================================
    */

    cube.current.rotation.x += delta * 0.105;

    cube.current.rotation.y += delta * 0.145;

    cube.current.rotation.z = Math.sin(time * 0.28 + index * 1.7) * 0.018;

    /*
    ====================================================
    SUBTLE FLOAT
    ====================================================
    */

    if (progress >= 1) {
      group.current.position.y =
        target.y + Math.sin(time * 0.55 + index * 1.35) * 0.025;
    }

    /*
    ====================================================
    INTERNAL TECHNICAL DETAIL
    Very subtle — NOT grey lines.
    ====================================================
    */

    if (inner.current) {
      inner.current.rotation.x -= delta * 0.08;

      inner.current.rotation.y += delta * 0.11;

      const innerScale = 0.78 + Math.sin(time * 0.7 + index) * 0.025;

      inner.current.scale.setScalar(innerScale);
    }

    /*
    ====================================================
    MAGENTA ENERGY AURA
    ====================================================
    */

    if (accent) {
      const pulse = 1 + Math.sin(time * 1.45 + index) * 0.12;

      if (aura1.current) {
        aura1.current.scale.setScalar(pulse);

        aura1.current.material.opacity =
          0.035 + Math.sin(time * 1.45 + index) * 0.012;
      }

      if (aura2.current) {
        aura2.current.scale.setScalar(pulse * 1.18);

        aura2.current.material.opacity =
          0.018 + Math.sin(time * 1.2 + index) * 0.008;
      }
    }
  });

  return (
    <group ref={group}>
      {/* =============================================
          MAIN CUBE
      ============================================= */}

      <RoundedBox
        ref={cube}
        args={[size, size, size]}
        radius={0.055}
        smoothness={5}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={accent ? 0.16 : 0.28}
          metalness={accent ? 0.55 : 0.28}
          clearcoat={0.65}
          clearcoatRoughness={0.15}
          emissive={accent ? COLORS.magenta : COLORS.midnight}
          emissiveIntensity={accent ? 0.4 : 0}
        />
      </RoundedBox>

      {/* =============================================
          ULTRA-SUBTLE INTERNAL STRUCTURE
          Almost invisible
      ============================================= */}

      <mesh ref={inner} scale={0.78}>
        <boxGeometry args={[1, 1, 1]} />

        <meshBasicMaterial
          color={accent ? COLORS.magenta : COLORS.navy}
          wireframe
          transparent
          opacity={0.015}
        />
      </mesh>

      {/* =============================================
          MAGENTA AURA
      ============================================= */}

      {accent && (
        <>
          <mesh ref={aura1} scale={1.3}>
            <boxGeometry args={[1, 1, 1]} />

            <meshBasicMaterial
              color={COLORS.magenta}
              transparent
              opacity={0.04}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh ref={aura2} scale={1.5}>
            <boxGeometry args={[1, 1, 1]} />

            <meshBasicMaterial
              color={COLORS.magenta}
              transparent
              opacity={0.02}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ======================================================
   CENTRAL ENERGY CORE
====================================================== */

function EnergyCore() {
  const group = useRef();
  const shell1 = useRef();
  const shell2 = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();

    /*
    Slowly activate the core.
    */

    const activation = smoothStep(clamp01((time - 0.8) / 1.7));

    group.current.scale.setScalar(activation);

    /*
    Outer shell.
    */

    if (shell1.current) {
      shell1.current.rotation.x += delta * 0.24;

      shell1.current.rotation.y -= delta * 0.31;

      shell1.current.rotation.z += delta * 0.08;
    }

    /*
    Inner shell.
    */

    if (shell2.current) {
      shell2.current.rotation.x -= delta * 0.17;

      shell2.current.rotation.z += delta * 0.36;
    }

    /*
    Energy nucleus.
    */

    if (core.current) {
      core.current.rotation.x += delta * 0.42;

      core.current.rotation.y += delta * 0.52;

      const pulse = 1 + Math.sin(time * 1.7) * 0.12;

      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} position={[0.1, 0.15, 0.45]}>
      {/* Outer energy shell */}

      <mesh ref={shell1}>
        <icosahedronGeometry args={[0.34, 2]} />

        <meshBasicMaterial
          color={COLORS.magenta}
          wireframe
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Secondary shell */}

      <mesh ref={shell2}>
        <octahedronGeometry args={[0.27, 2]} />

        <meshBasicMaterial
          color={COLORS.magenta}
          wireframe
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Core */}

      <mesh ref={core}>
        <octahedronGeometry args={[0.13, 1]} />

        <meshBasicMaterial
          color={COLORS.magenta}
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ======================================================
   MOVING MAGENTA DATA SIGNAL
====================================================== */

function DataPacket({ start, end, delay = 0, reverse = false, size = 0.028 }) {
  const ref = useRef();

  const startVector = useMemo(() => new THREE.Vector3(...start), [start]);

  const endVector = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.getElapsedTime();

    let progress = (time * 0.075 + delay) % 1;

    if (reverse) {
      progress = 1 - progress;
    }

    /*
    Smooth signal movement.
    */

    const eased = smoothStep(progress);

    ref.current.position.lerpVectors(startVector, endVector, eased);

    /*
    Tiny depth offset.
    */

    ref.current.position.z += 0.08;

    /*
    Signal pulse.
    */

    const glow = 1 + Math.sin(progress * Math.PI) * 0.8;

    ref.current.scale.setScalar(glow);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />

      <meshBasicMaterial
        color={COLORS.magenta}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ======================================================
   INVISIBLE DATA PATHS
======================================================

 IMPORTANT:

 We keep the mathematical paths for the moving
 magenta signals.

 The actual grey/navy lines are NOT rendered.

 This gives the feeling that data is travelling
 between the cubes without cluttering the design.
====================================================== */

function Network() {
  const connections = [
    [
      [-1.6, 0.65, 0],
      [-0.5, 1.25, 0.1],
    ],

    [
      [0.5, 1.25, 0.1],
      [1.55, 0.55, 0],
    ],

    [
      [-1.55, -0.55, 0],
      [-0.55, -1.15, 0.1],
    ],

    [
      [0.55, -1.15, 0.1],
      [1.55, -0.55, 0],
    ],
  ];

  return (
    <group>
      {connections.map((points, index) => (
        <DataPacket
          key={index}
          start={points[0]}
          end={points[1]}
          delay={index * 0.27}
          reverse={index % 2 === 1}
        />
      ))}
    </group>
  );
}

/* ======================================================
   SINGLE MAGENTA ORBIT
====================================================== */

function OrbitalSystem() {
  const ring = useRef();

  useFrame((state, delta) => {
    if (!ring.current) return;

    const time = state.clock.getElapsedTime();

    ring.current.rotation.z += delta * 0.028;

    ring.current.rotation.x = Math.sin(time * 0.18) * 0.035;

    ring.current.rotation.y = Math.cos(time * 0.15) * 0.025;
  });

  return (
    <mesh ref={ring} rotation={[0.9, Math.PI / 3, 0]}>
      <torusGeometry args={[1.95, 0.004, 8, 160]} />

      <meshBasicMaterial
        color={COLORS.magenta}
        transparent
        opacity={0.13}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ======================================================
   SUBTLE MAGENTA SCANNER
====================================================== */

function Scanner() {
  const beam = useRef();

  useFrame((state) => {
    if (!beam.current) return;

    const time = state.clock.getElapsedTime();

    beam.current.position.y = Math.sin(time * 0.26) * 1.25;

    beam.current.material.opacity =
      0.008 + Math.abs(Math.sin(time * 0.26)) * 0.018;
  });

  return (
    <mesh ref={beam} position={[0, 0, -0.42]}>
      <planeGeometry args={[3.9, 0.018]} />

      <meshBasicMaterial
        color={COLORS.magenta}
        transparent
        opacity={0.012}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ======================================================
   PARTICLE ENVIRONMENT
====================================================== */

function ParticleSystem() {
  return (
    <>
      {/* Navy atmospheric particles */}

      <Sparkles
        count={42}
        scale={[4.4, 3.3, 2.7]}
        size={0.9}
        speed={0.1}
        opacity={0.2}
        color={COLORS.navy}
        noise={[0.2, 0.4, 0.2]}
      />

      {/* Magenta energy particles */}

      <Sparkles
        count={12}
        scale={[3.0, 2.4, 2.0]}
        size={1.25}
        speed={0.13}
        opacity={0.25}
        color={COLORS.magenta}
        noise={[0.15, 0.3, 0.15]}
      />
    </>
  );
}

/* ======================================================
   SYSTEM CONTROLLER
====================================================== */

function SystemController({ children }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();

    /*
    ====================================================
    MOUSE PARALLAX
    ====================================================
    */

    const targetRotationY = state.pointer.x * 0.09;

    const targetRotationX = -state.pointer.y * 0.055;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY,
      1.7 * delta,
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX,
      1.7 * delta,
    );

    /*
    ====================================================
    BREATHING
    ====================================================
    */

    const breathing = 1 + Math.sin(time * 0.32) * 0.006;

    group.current.scale.setScalar(breathing);

    /*
    ====================================================
    SUBTLE DEPTH
    ====================================================
    */

    group.current.position.z = Math.sin(time * 0.22) * 0.018;
  });

  return <group ref={group}>{children}</group>;
}

/* ======================================================
   MAIN SCENE
====================================================== */
function ShadowCatcher() {
  return (
    <mesh
      position={[0, -1.45, -0.65]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[5, 4]} />

      <shadowMaterial transparent opacity={0.13} />
    </mesh>
  );
}
function Scene() {
  /*
  ======================================================
  ORIGINAL CUBE ALIGNMENT
  ======================================================

  DO NOT CHANGE THESE POSITIONS.

  These are intentionally preserved from your
  previous animation.
  ======================================================
  */

  const cubes = [
    {
      position: [-0.9, 0.65, 0],
      size: 1.05,
      color: COLORS.navy,
      delay: 0,
      index: 0,
    },

    {
      position: [0.45, 0.95, 0.1],
      size: 0.78,
      color: COLORS.ice,
      delay: 0.7,
      index: 1,
    },

    {
      position: [1.0, -0.2, 0],
      size: 0.98,
      color: COLORS.navy,
      delay: 1.2,
      index: 2,
    },

    {
      position: [-0.15, -0.55, 0.1],
      size: 0.86,
      color: COLORS.ice,
      delay: 1.8,
      index: 3,
    },

    {
      position: [-1.1, -0.45, -0.1],
      size: 0.7,
      color: COLORS.magenta,
      accent: true,
      delay: 2.2,
      index: 4,
    },

    {
      position: [0.1, 0.15, 0.45],
      size: 0.58,
      color: COLORS.magenta,
      accent: true,
      delay: 2.8,
      index: 5,
    },
  ];

  return (
    <SystemController>
      {/* =============================================
          SIX MAIN CUBES
      ============================================= */}

      {cubes.map((cube, index) => (
        <SystemCube key={index} {...cube} />
      ))}

      {/* =============================================
          CENTRAL ENERGY
      ============================================= */}

      <EnergyCore />

      {/* =============================================
          INVISIBLE DATA PATHS + MAGENTA SIGNALS
      ============================================= */}

      <Network />

      {/* =============================================
          SINGLE MAGENTA ORBIT
      ============================================= */}

   

      {/* =============================================
          SUBTLE SCANNER
      ============================================= */}

      <Scanner />

      {/* =============================================
          FLOATING PARTICLES
      ============================================= */}

      <ParticleSystem />
    </SystemController>
  );
}

/* ======================================================
   HERO CUBE
====================================================== */

export default function HeroCube() {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;
  const lowPower = reduceMotion || coarsePointer;

  return (
    <div
      className="hero-cube"
      aria-label="Interactive Builstry innovation system"
    >
      <Canvas
        dpr={lowPower ? 1 : [1, 1.5]}
        frameloop={reduceMotion ? "demand" : "always"}
        shadows={!lowPower}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: lowPower ? "low-power" : "high-performance",
        }}
      >
        {/* ============================================
            CAMERA
        ============================================ */}

        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />

        {/* ============================================
            LIGHTING
        ============================================ */}

        <ambientLight intensity={0.85} />

        <directionalLight
          position={[4, 5, 6]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={12}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0002}
          shadow-normalBias={0.02}
          shadow-radius={4}
        />

        <directionalLight position={[-4, -2, 2]} intensity={1.15} />

        {/* Magenta energy */}

        <pointLight
          position={[0.1, 0.2, 1.8]}
          color={COLORS.magenta}
          intensity={1.5}
          distance={4}
        />

        {/* Navy rim */}

        <pointLight
          position={[-2, 1, 2]}
          color={COLORS.navy}
          intensity={1}
          distance={4}
        />

        {/* ============================================
            MAIN SYSTEM
        ============================================ */}
        <ShadowCatcher />
        <Scene />
      </Canvas>
    </div>
  );
}
