/**
 * scene.js — holographic Hyper Advance emblem.
 *
 * Geometry comes from the official logo PNG (see logo-trace.js): every dot and
 * every edge is sampled from the artwork, so the mark is exact. The four inks of
 * the lockup are separated into depth layers, which is what gives the hologram
 * volume under parallax:
 *
 *   land (-2.1)  →  globe disc (-0.9)  →  graticule (0.4)  →  A/H monogram (1.3)
 *
 * Everything is additive on a near-black stage; UnrealBloom lifts the edges into
 * a glow. One uniform (uProgress) per layer drives the build-in sequence.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PALETTE } from './palette.js';
import { traceLogo } from './logo-trace.js';
import { addDrawOrder, buildGroundDots, decoratePoints } from './mark.js';

const DEFAULTS = {
  dprCap: 1.75,
  parallax: 1,
  autoRotate: true,
  interactive: true,
  logoUrl: './assets/hyper-advance-logo.png',
  targetHeight: 20,
  bloom: { strength: 0.52, radius: 0.55, threshold: 0.24 },
};

const TIMELINE = {
  ground: { delay: 0.1, duration: 1.2 },
  land: { delay: 0.45, duration: 1.2 },
  globe: { delay: 0.7, duration: 1.3 },
  grid: { delay: 0.95, duration: 1.2 },
  ink: { delay: 1.05, duration: 1.4 },
};

const LAYERS = [
  {
    key: 'land',
    z: -2.1,
    pointOpacity: 0.4,
    edgeOpacity: 0.8,
    pointColor: PALETTE.landDim,
    pointColorAlt: PALETTE.land,
    edgeColor: PALETTE.land,
    size: 1.05,
  },
  {
    key: 'globe',
    z: -0.9,
    pointOpacity: 0.08,
    edgeOpacity: 0.3,
    pointColor: PALETTE.greenDeep,
    pointColorAlt: PALETTE.teal,
    edgeColor: PALETTE.teal,
    size: 0.8,
  },
  {
    key: 'grid',
    z: 0.4,
    pointOpacity: 0.45,
    edgeOpacity: 0.2,
    pointColor: PALETTE.teal,
    pointColorAlt: PALETTE.mintBright,
    edgeColor: PALETTE.mint,
    size: 0.8,
  },
  {
    key: 'ink',
    z: 1.3,
    pointOpacity: 0.8,
    edgeOpacity: 1,
    pointColor: PALETTE.mint,
    pointColorAlt: PALETTE.mintBright,
    edgeColor: PALETTE.mintBright,
    size: 1.05,
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function progressAt(t, { delay, duration }) {
  return easeOut(clamp01((t - delay) / duration));
}

/* ---------------------------------------------------------------- */
/* Materials                                                         */
/* ---------------------------------------------------------------- */

function lineMaterial({ color, opacity, fadeNear = 44, fadeFar = 150 }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uProgress: { value: 0 },
      uFadeNear: { value: fadeNear },
      uFadeFar: { value: fadeFar },
    },
    vertexShader: /* glsl */ `
      attribute float aOrder;
      uniform float uProgress;
      uniform float uFadeNear;
      uniform float uFadeFar;
      varying float vReveal;
      varying float vFade;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vReveal = smoothstep(aOrder, aOrder + 0.1, uProgress);
        vFade = 1.0 - smoothstep(uFadeNear, uFadeFar, -mvPosition.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vReveal;
      varying float vFade;
      void main() {
        float alpha = uOpacity * vReveal * vFade;
        if (alpha < 0.003) discard;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

function pointMaterial({ colorA, colorB, opacity, range = 84, fadeNear = 36, fadeFar = 150 }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: opacity },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uRange: { value: range },
      uFadeNear: { value: fadeNear },
      uFadeFar: { value: fadeFar },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      attribute float aTint;
      uniform float uTime;
      uniform float uProgress;
      uniform float uPixelRatio;
      uniform float uRange;
      uniform float uFadeNear;
      uniform float uFadeFar;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float dist = max(-mvPosition.z, 0.001);
        float twinkle = 0.86 + 0.14 * sin(uTime * 1.2 + aPhase);
        float fade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
        gl_PointSize = clamp(aSize * uPixelRatio * uRange / dist, 0.0, 18.0) * uProgress;
        vColor = mix(uColorA, uColorB, aTint);
        vAlpha = twinkle * fade * uProgress;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 offset = gl_PointCoord - 0.5;
        float dist = length(offset);
        if (dist > 0.5) discard;
        float core = smoothstep(0.5, 0.0, dist);
        float alpha = pow(core, 1.9) * vAlpha;
        if (alpha < 0.003) discard;
        vec3 tint = mix(vColor, vec3(1.0), pow(core, 6.0) * 0.55);
        gl_FragColor = vec4(tint, alpha);
      }
    `,
  });
}

/* ---------------------------------------------------------------- */
/* Geometry helpers                                                  */
/* ---------------------------------------------------------------- */

/** Boundary samples arrive as [x0,y0,x1,y1,…] pairs; lift them to a layer depth. */
function lineGeometryFromPairs(pairs, z) {
  const count = pairs.length / 2;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = pairs[i * 2];
    positions[i * 3 + 1] = pairs[i * 2 + 1];
    positions[i * 3 + 2] = z;
  }
  return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3));
}

function pointGeometryFromPoints(points, z) {
  const positions = new Float32Array(points.length * 3);
  points.forEach(([x, y], i) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.04;
  });
  return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3));
}

/* ---------------------------------------------------------------- */
/* Scene                                                             */
/* ---------------------------------------------------------------- */

export async function createHeroScene(container, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const reducedMotion =
    config.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The artwork is the geometry — trace it before anything is mounted.
  const trace = await traceLogo(config.logoUrl, { targetHeight: config.targetHeight });

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, config.dprCap);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = 'ha-canvas';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.bg);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  const rig = new THREE.Group();
  scene.add(rig);

  /* ---- starfield ---- */
  const starCount = 2100;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const radius = 58 + Math.random() * 110;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * 1.7;
    starPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.9;
    starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 20;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  decoratePoints(starGeometry, { size: 2.1, spread: 3.4, tint: 0.9 });
  const starMaterial = pointMaterial({
    colorA: PALETTE.teal,
    colorB: PALETTE.mintBright,
    opacity: 0.46,
    range: 56,
    fadeNear: 400,
    fadeFar: 900,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.renderOrder = -6;
  stars.frustumCulled = false;
  scene.add(stars);

  /* ---- dotted ground ---- */
  const ground = buildGroundDots();
  const groundGeometry = new THREE.BufferGeometry();
  groundGeometry.setAttribute('position', new THREE.BufferAttribute(ground.positions, 3));
  const groundCount = ground.falloff.length;
  const groundSizes = new Float32Array(groundCount);
  const groundPhases = new Float32Array(groundCount);
  const groundTints = new Float32Array(groundCount);
  for (let i = 0; i < groundCount; i += 1) {
    groundSizes[i] = 0.5 + ground.falloff[i] * 1.3 + Math.random() * 0.2;
    groundPhases[i] = Math.random() * Math.PI * 2;
    groundTints[i] = 0.1 + Math.random() * 0.55;
  }
  groundGeometry.setAttribute('aSize', new THREE.BufferAttribute(groundSizes, 1));
  groundGeometry.setAttribute('aPhase', new THREE.BufferAttribute(groundPhases, 1));
  groundGeometry.setAttribute('aTint', new THREE.BufferAttribute(groundTints, 1));
  const groundMaterial = pointMaterial({
    colorA: PALETTE.greenDeep,
    colorB: PALETTE.mint,
    opacity: 0.42,
    range: 80,
    fadeNear: 34,
    fadeFar: 120,
  });
  const groundPoints = new THREE.Points(groundGeometry, groundMaterial);
  groundPoints.renderOrder = -4;
  groundPoints.frustumCulled = false;
  rig.add(groundPoints);

  /* ---- stage rings ---- */
  const ringMaterials = [];
  const ringGroup = new THREE.Group();
  ringGroup.position.y = -13.3;
  rig.add(ringGroup);

  function buildGroundRing(radius, color, opacity) {
    const segments = 240;
    const positions = [];
    const step = (Math.PI * 2) / segments;
    for (let i = 0; i < segments; i += 1) {
      if (i % 4 === 3) continue;
      const a0 = i * step;
      const a1 = a0 + step * 0.7;
      positions.push(Math.cos(a0) * radius, 0, Math.sin(a0) * radius);
      positions.push(Math.cos(a1) * radius, 0, Math.sin(a1) * radius);
    }
    const geometry = addDrawOrder(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)),
      { perSegment: true, jitter: 0.01 }
    );
    const material = lineMaterial({ color, opacity, fadeNear: 44, fadeFar: 140 });
    ringMaterials.push(material);
    const line = new THREE.LineSegments(geometry, material);
    line.renderOrder = -3;
    return line;
  }

  ringGroup.add(buildGroundRing(16, PALETTE.mint, 0.24));
  ringGroup.add(buildGroundRing(24, PALETTE.teal, 0.14));
  ringGroup.add(buildGroundRing(34, PALETTE.greenDeep, 0.16));

  /* ---- the traced emblem ---- */
  const emblem = new THREE.Group();
  rig.add(emblem);

  const layerState = [];

  LAYERS.forEach((spec) => {
    const data = trace.layers[spec.key];
    if (!data) return;

    const pointGeometry = decoratePoints(pointGeometryFromPoints(data.points, spec.z), {
      size: spec.size,
      spread: 0.26,
      tint: 0.45,
    });
    const pointMaterialRef = pointMaterial({
      colorA: spec.pointColor,
      colorB: spec.pointColorAlt,
      opacity: spec.pointOpacity,
      range: 86,
      fadeNear: 40,
      fadeFar: 150,
    });
    const points = new THREE.Points(pointGeometry, pointMaterialRef);
    points.renderOrder = spec.z * 2;
    points.frustumCulled = false;
    emblem.add(points);

    let edgeMaterialRef = null;
    if (data.edges.length) {
      const edgeGeometry = addDrawOrder(lineGeometryFromPairs(data.edges, spec.z + 0.01), {
        perSegment: true,
        jitter: 0.02,
      });
      edgeMaterialRef = lineMaterial({
        color: spec.edgeColor,
        opacity: spec.edgeOpacity,
        fadeNear: 40,
        fadeFar: 150,
      });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterialRef);
      edges.renderOrder = spec.z * 2 + 0.5;
      edges.frustumCulled = false;
      emblem.add(edges);
    }

    layerState.push({ key: spec.key, pointMaterial: pointMaterialRef, edgeMaterial: edgeMaterialRef });
  });

  /* ---- postprocessing ---- */
  // Materials whose fade / point-size envelope must follow the camera distance.
  const adjustable = [];
  rig.traverse((object) => {
    const material = object.material;
    if (material && material.uniforms && material.uniforms.uFadeNear) adjustable.push(material);
  });

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(dpr);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth || 1, container.clientHeight || 1),
    config.bloom.strength,
    config.bloom.radius,
    config.bloom.threshold
  );
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  /* ---------------------------------------------------------------- */
  /* Interaction state                                                 */
  /* ---------------------------------------------------------------- */

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  const drag = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, lastX: 0, lastY: 0 };
  let running = true;
  let visible = true;
  let motion = !reducedMotion;
  let elapsed = reducedMotion ? 8 : 0;
  let raf = 0;
  let lastFrame = performance.now();
  let fps = 60;
  let fpsAccum = 0;
  let fpsFrames = 0;
  const baseCamera = new THREE.Vector3(0, 6.4, 60);
  let disposed = false;

  const onPointerMove = (event) => {
    if (!config.interactive) return;
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
    if (drag.active) {
      drag.targetX += (event.clientX - drag.lastX) * 0.0042;
      drag.targetY += (event.clientY - drag.lastY) * 0.003;
      drag.targetX = Math.max(-0.75, Math.min(0.75, drag.targetX));
      drag.targetY = Math.max(-0.35, Math.min(0.35, drag.targetY));
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
    }
  };

  const onPointerDown = (event) => {
    if (!config.interactive) return;
    drag.active = true;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    container.setPointerCapture?.(event.pointerId);
  };

  const onPointerUp = (event) => {
    drag.active = false;
    container.releasePointerCapture?.(event.pointerId);
  };

  const onPointerLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };

  if (config.interactive) {
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
  }

  /* ---------------------------------------------------------------- */
  /* Resize + fit                                                      */
  /* ---------------------------------------------------------------- */

  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    const aspect = width / height;
    const compact = aspect < 0.95;

    renderer.setSize(width, height, false);
    camera.aspect = aspect;

    // Split hero: emblem left of centre on wide screens, centred on phones.
    rig.position.x = compact ? 0 : -7;
    rig.position.y = compact ? 11.5 : 3.6;

    // On phones the emblem is fitted to the available width above the card.
    const viewHeight = compact ? (trace.width + 4) / Math.max(aspect, 0.35) : 33;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const distance = (viewHeight * 0.5) / Math.tan(vFov / 2);

    baseCamera.set(0, compact ? 5 : 6.6, distance);
    camera.position.copy(baseCamera);
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();

    const ratio = Math.min(window.devicePixelRatio || 1, config.dprCap);
    renderer.setPixelRatio(ratio);
    composer.setPixelRatio(ratio);
    composer.setSize(width, height);

    // Keep the artwork's dot size and depth falloff constant on every screen:
    // the camera pulls back a long way on narrow viewports.
    const fadeNear = distance * 1.15;
    const fadeFar = distance * 2.6;
    // Dots keep roughly their proportion of the emblem as the camera pulls back.
    const sizeScale = Math.pow(distance / 62, 0.35);
    adjustable.forEach((material) => {
      material.uniforms.uFadeNear.value = fadeNear;
      material.uniforms.uFadeFar.value = fadeFar;
      if (material.uniforms.uRange) material.uniforms.uRange.value = 86 * sizeScale;
    });

    [starMaterial, groundMaterial].forEach((material) => {
      material.uniforms.uPixelRatio.value = ratio;
    });
    layerState.forEach(({ pointMaterial: material }) => {
      material.uniforms.uPixelRatio.value = ratio;
    });
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  /* ---------------------------------------------------------------- */
  /* Frame loop                                                        */
  /* ---------------------------------------------------------------- */

  function update(time, dt) {
    const damping = 1 - Math.exp(-6 * dt);
    smooth.x += (pointer.x - smooth.x) * damping * config.parallax;
    smooth.y += (pointer.y - smooth.y) * damping * config.parallax;

    drag.x += (drag.targetX - drag.x) * damping;
    drag.y += (drag.targetY - drag.y) * damping;

    const sway = motion ? Math.sin(time * 0.1) * 0.06 : 0;
    const yaw = smooth.x * 0.16 + drag.x + sway;
    const pitch = -smooth.y * 0.08 + drag.y;

    rig.rotation.y = yaw * 0.65;
    rig.rotation.x = pitch * 0.55;

    camera.position.x = baseCamera.x + smooth.x * 1.5;
    camera.position.y = baseCamera.y - smooth.y * 1.1;
    camera.lookAt(smooth.x * 1.2, 0.2 - smooth.y * 0.7, 0);

    if (motion) {
      emblem.position.y = Math.sin(time * 0.55) * 0.12;
      stars.rotation.y = time * 0.006;
    }

    const groundP = progressAt(elapsed, TIMELINE.ground);
    groundMaterial.uniforms.uProgress.value = groundP;
    ringMaterials.forEach((material, i) => {
      material.uniforms.uProgress.value = progressAt(elapsed, {
        delay: TIMELINE.ground.delay + i * 0.1,
        duration: TIMELINE.ground.duration,
      });
    });

    layerState.forEach(({ key, pointMaterial: points, edgeMaterial }) => {
      const p = progressAt(elapsed, TIMELINE[key]);
      points.uniforms.uProgress.value = p;
      if (edgeMaterial) edgeMaterial.uniforms.uProgress.value = p;
    });

    starMaterial.uniforms.uProgress.value = progressAt(elapsed, { delay: 0, duration: 1.6 });
    starMaterial.uniforms.uTime.value = time;
    groundMaterial.uniforms.uTime.value = time;
    layerState.forEach(({ pointMaterial: material }) => {
      material.uniforms.uTime.value = time;
    });
  }

  function frame(now) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (!running || !visible) {
      lastFrame = now;
      return;
    }
    const dt = Math.min((now - lastFrame) / 1000, 0.06);
    lastFrame = now;
    elapsed += dt;
    const time = now / 1000;

    update(time, dt);
    composer.render();

    fpsAccum += dt;
    fpsFrames += 1;
    if (fpsAccum > 0.5) {
      fps = fpsFrames / fpsAccum;
      fpsAccum = 0;
      fpsFrames = 0;
    }
  }

  const onVisibility = () => {
    visible = document.visibilityState !== 'hidden';
  };
  document.addEventListener('visibilitychange', onVisibility);

  const intersection = new IntersectionObserver(
    (entries) => {
      running = entries[0]?.isIntersecting !== false;
    },
    { threshold: 0.01 }
  );
  intersection.observe(container);

  const onContextLost = (event) => {
    event.preventDefault();
    running = false;
  };
  const onContextRestored = () => {
    running = true;
  };
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

  raf = requestAnimationFrame(frame);

  return {
    renderer,
    scene,
    camera,
    bloomPass,
    trace,
    getReadout() {
      return {
        fps: Math.round(fps),
        azimuth: Math.round(THREE.MathUtils.radToDeg(-rig.rotation.y) * 10) / 10,
        elevation: Math.round(THREE.MathUtils.radToDeg(rig.rotation.x) * 10) / 10,
        motion,
      };
    },
    setMotion(value) {
      motion = value;
    },
    setPaused(value) {
      running = !value;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      rig.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      starGeometry.dispose();
      starMaterial.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
