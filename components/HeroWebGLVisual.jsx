import { useEffect, useRef } from "react";
import * as THREE from "three";
import { heroFragmentShader, heroVertexShader } from "./HeroVisualShader";

const MAGENTA = 0xc51f5d;
const ICE = 0xf7f8fa;

function createShellGeometry(detail) {
  const radialSegments = detail;
  const heightSegments = Math.max(24, Math.round(detail * 0.44));
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y <= heightSegments; y += 1) {
    const v = y / heightSegments;
    const height = (v - 0.5) * 2.15;
    const taper = 0.72 + Math.sin(v * Math.PI) * 0.2;
    for (let x = 0; x <= radialSegments; x += 1) {
      const u = x / radialSegments;
      const angle = u * Math.PI * 2;
      const ribs = 1 + Math.cos(angle * 8 + v * 1.7) * 0.055;
      const waist = 1 + Math.sin(v * Math.PI * 2) * 0.035;
      const radius = taper * ribs * waist;
      positions.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius * (0.72 + Math.sin(v * Math.PI) * 0.13),
      );
      uvs.push(u, v);
    }
  }

  for (let y = 0; y < heightSegments; y += 1) {
    for (let x = 0; x < radialSegments; x += 1) {
      const a = y * (radialSegments + 1) + x;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createRibGeometry() {
  const points = [];
  const ribs = 18;
  const steps = 32;
  for (let rib = 0; rib < ribs; rib += 1) {
    const angle = (rib / ribs) * Math.PI * 2;
    for (let step = 0; step < steps; step += 1) {
      const v0 = step / steps;
      const v1 = (step + 1) / steps;
      const radius0 = (0.72 + Math.sin(v0 * Math.PI) * 0.2) * (1 + Math.cos(angle * 8 + v0 * 1.7) * 0.055);
      const radius1 = (0.72 + Math.sin(v1 * Math.PI) * 0.2) * (1 + Math.cos(angle * 8 + v1 * 1.7) * 0.055);
      const zScale0 = 0.72 + Math.sin(v0 * Math.PI) * 0.13;
      const zScale1 = 0.72 + Math.sin(v1 * Math.PI) * 0.13;
      points.push(
        Math.cos(angle) * radius0, (v0 - 0.5) * 2.15, Math.sin(angle) * radius0 * zScale0,
        Math.cos(angle) * radius1, (v1 - 0.5) * 2.15, Math.sin(angle) * radius1 * zScale1,
      );
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

function createParticles(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.25 + Math.random() * 1.2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

export default function HeroWebGLVisual({ stageRef, motionRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;
    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const memory = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const lowPower = memory <= 4 || cores <= 4;
    const simpleMode = isMobile || lowPower;
    let renderer;
    let observer;
    let frame = 0;
    let disposed = false;
    let failed = false;
    let slowFrames = 0;
    let previousFrameTime = performance.now();
    const startTime = previousFrameTime;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const disableWebGL = (error) => {
      if (failed) return;
      failed = true;
      stage.classList.remove("webgl-ready");
      if (error) console.warn("Builstry hero WebGL unavailable; using the CSS visual fallback.", error);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !simpleMode,
        powerPreference: simpleMode ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
      });
    } catch (error) {
      disableWebGL(error);
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 5.4);
    const material = new THREE.ShaderMaterial({
      vertexShader: heroVertexShader,
      fragmentShader: heroFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uState: { value: 0 },
        uDistortion: { value: simpleMode ? 0.45 : 0.8 },
        uIntensity: { value: 0.82 },
        uMouse: { value: new THREE.Vector2() },
        uColorAccent: { value: new THREE.Color(MAGENTA) },
      },
    });
    const shell = new THREE.Mesh(createShellGeometry(simpleMode ? 64 : 112), material);
    shell.rotation.y = -0.28;
    scene.add(shell);

    const ribs = new THREE.LineSegments(
      createRibGeometry(),
      new THREE.LineBasicMaterial({ color: ICE, transparent: true, opacity: 0.34 }),
    );
    ribs.rotation.y = shell.rotation.y;
    scene.add(ribs);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: MAGENTA,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const rings = [0.98, 0.83, 0.68].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.006, 3, simpleMode ? 48 : 88),
        ringMaterial,
      );
      ring.rotation.set(index * 0.28, index * 0.42, Math.PI * 0.5 + index * 0.3);
      ring.position.y = (index - 1) * 0.17;
      ring.scale.y = 0.77;
      scene.add(ring);
      return ring;
    });

    const particleGeometry = createParticles(simpleMode ? 96 : 480);
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: ICE,
        size: simpleMode ? 0.018 : 0.014,
        transparent: true,
        opacity: 0.34,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const disposeScene = () => {
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) {
          const entries = Array.isArray(object.material) ? object.material : [object.material];
          entries.forEach((entry) => materials.add(entry));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((entry) => entry.dispose());
    };

    const resize = () => {
      if (disposed || failed) return;
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, simpleMode ? 1 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = Math.min(50, Math.max(34, 34 + (camera.aspect < 0.9 ? 16 : 0)));
      camera.updateProjectionMatrix();
    };

    let resizeObserver;
    const onPointerMove = (event) => {
      if (isMobile) return;
      const bounds = stage.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const onContextLost = (event) => {
      event.preventDefault();
      disableWebGL(new Error("WebGL context was lost."));
    };

    const render = () => {
      if (disposed || failed) return;
      frame = window.requestAnimationFrame(render);
      const now = performance.now();
      const delta = now - previousFrameTime;
      previousFrameTime = now;
      slowFrames = delta > 45 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 120) {
        disableWebGL(new Error("WebGL frame rate remained below the performance threshold."));
        return;
      }
      const time = (now - startTime) * 0.001;
      const motion = motionRef.current;
      const progress = motion.progress * (1 - Math.min(1, Math.max(0, (motion.progress - 0.78) / 0.22) * 0.28));
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;

      material.uniforms.uTime.value = time;
      material.uniforms.uProgress.value = progress;
      material.uniforms.uState.value = progress * 3;
      material.uniforms.uIntensity.value = 0.72 + Math.sin(progress * Math.PI * 3) ** 2 * 0.2;
      material.uniforms.uMouse.value.set(pointer.x, pointer.y);
      camera.position.x = -0.13 + progress * 0.26 + pointer.x * 0.07;
      camera.position.y = 0.08 - progress * 0.16 - pointer.y * 0.06;
      camera.position.z = 5.4 - progress * 0.12;
      camera.lookAt(0, 0, 0);
      shell.rotation.y = -0.28 + progress * 0.55 + pointer.x * 0.035;
      shell.rotation.x = Math.sin(time * 0.18) * 0.025 + pointer.y * 0.025;
      ribs.rotation.y = shell.rotation.y;
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.0004 * (index % 2 ? -1 : 1);
        ring.material.opacity = 0.18 + material.uniforms.uIntensity.value * 0.16;
      });
      particles.rotation.y = progress * 0.18 + pointer.x * 0.025;
      particles.position.x = pointer.x * 0.035;
      try {
        renderer.render(scene, camera);
      } catch (error) {
        disableWebGL(error);
      }
    };

    try {
      resize();
      renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
        const log = gl.getProgramInfoLog(program) || gl.getShaderInfoLog(fragmentShader) || gl.getShaderInfoLog(vertexShader);
        disableWebGL(new Error(`Hero shader compilation failed: ${log || "unknown shader error"}`));
      };
      renderer.compile(scene, camera);
      if (failed) {
        disposeScene();
        renderer.dispose();
        return undefined;
      }
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      stage.addEventListener("pointermove", onPointerMove, { passive: true });
      stage.addEventListener("pointerleave", onPointerLeave, { passive: true });
      canvas.addEventListener("webglcontextlost", onContextLost, false);
      stage.classList.add("webgl-ready");
      frame = window.requestAnimationFrame(render);

      return () => {
        disposed = true;
        resizeObserver?.disconnect();
        stage.classList.remove("webgl-ready");
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onPointerLeave);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        if (frame) window.cancelAnimationFrame(frame);
        disposeScene();
        renderer.dispose();
      };
    } catch (error) {
      resizeObserver?.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      disposeScene();
      renderer.dispose();
      disableWebGL(error);
      return undefined;
    }
  }, [motionRef, stageRef]);

  return <canvas ref={canvasRef} className="hero-webgl-canvas" aria-hidden="true" />;
}
