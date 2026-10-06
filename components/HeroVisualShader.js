export const heroVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uState;
  uniform float uDistortion;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vUv = uv;
    float progressCycle = fract(uProgress * 3.0);
    float edgeDistance = min(progressCycle, 1.0 - progressCycle);
    float transitionPulse = exp(-edgeDistance * 24.0) * step(0.02, uProgress) * (1.0 - step(0.98, uProgress));
    float field = noise(position * 2.1 + vec3(0.0, uTime * 0.08, uProgress * 2.0));
    float wave = sin(uv.x * 18.0 + uv.y * 11.0 + uProgress * 18.84956 + uTime * 0.22);
    float stateShape = sin(uState * 1.0472 + uv.x * 6.2832);
    float displacement = (field - 0.5) * 0.055 + wave * 0.012 + stateShape * 0.009;
    displacement *= uDistortion * (0.35 + transitionPulse * 1.25);
    vec3 transformed = position + normal * displacement;
    transformed.x *= 1.0 + sin(uState * 1.0472) * sin(uv.y * 9.42478) * 0.075;
    transformed.z *= 1.0 + cos(uState * 1.0472) * cos(uv.x * 12.5664) * 0.065;
    transformed.y += stateShape * 0.04;
    transformed.x += uMouse.x * (0.025 + uv.y * 0.035);
    transformed.z += uMouse.y * 0.025;
    vNormal = normalize(normalMatrix * normal);
    vPosition = transformed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const heroFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uState;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform vec3 uColorAccent;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 keyLight = normalize(vec3(-0.45, 0.7, 0.8) + vec3(uMouse * 0.12, 0.0));
    float diffuse = max(dot(normal, keyLight), 0.0);
    float rim = pow(1.0 - abs(normal.z), 2.1);
    float bands = 0.5 + 0.5 * sin(vUv.y * (54.0 + mod(uState, 2.0) * 5.0) + vUv.x * 16.0 + uProgress * 9.42478);
    float progressCycle = fract(uProgress * 3.0);
    float edgeDistance = min(progressCycle, 1.0 - progressCycle);
    float transitionPulse = exp(-edgeDistance * 24.0) * step(0.02, uProgress) * (1.0 - step(0.98, uProgress));
    float sweepPosition = 0.16 + progressCycle * 0.68;
    float sweep = exp(-pow((vUv.x - sweepPosition) * 16.0, 2.0)) * transitionPulse;

    vec3 midnight = vec3(0.078, 0.114, 0.149);
    vec3 steel = vec3(0.141, 0.204, 0.278);
    vec3 ice = vec3(0.78, 0.84, 0.9);
    vec3 color = mix(midnight, steel, 0.35 + diffuse * 0.44);
    color += ice * (0.13 + bands * 0.07) * uIntensity;
    color += uColorAccent * (rim * 0.38 + sweep * 0.62) * uIntensity;
    color += vec3(0.055, 0.085, 0.12) * (0.5 + 0.5 * sin(vPosition.y * 3.0 + uTime * 0.18));

    float alpha = 0.58 + diffuse * 0.22 + rim * 0.18;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;
