/**
 * mark.js — shared geometry helpers.
 *
 * The emblem itself is NOT drawn here: it is sampled from the official logo PNG
 * in logo-trace.js. This module only builds the ambient stage (dotted ground) and
 * the attributes consumed by the line / point shaders.
 */
import * as THREE from 'three';

/** Jittered dotted floor field, fading out before the plane edge is visible. */
export function buildGroundDots({ extent = 46, step = 1.35, y = -13.4 } = {}) {
  const positions = [];
  const falloff = [];
  for (let x = -extent; x <= extent; x += step) {
    for (let z = -extent; z <= extent; z += step) {
      const d = Math.hypot(x, z);
      if (d > extent) continue;
      const jx = (Math.random() - 0.5) * step * 0.4;
      const jz = (Math.random() - 0.5) * step * 0.4;
      positions.push(x + jx, y, z + jz);
      falloff.push(Math.pow(1 - d / extent, 1.7));
    }
  }
  return { positions: new Float32Array(positions), falloff: new Float32Array(falloff) };
}

/**
 * Normalised vertical order used by the line shader to draw in.
 * perSegment keeps both endpoints of a LineSegments pair in sync.
 */
export function addDrawOrder(geometry, { jitter = 0.05, perSegment = false } = {}) {
  const position = geometry.getAttribute('position');
  const count = position.count;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < count; i += 1) {
    const y = position.getY(i);
    if (y < min) min = y;
    if (y > max) max = y;
  }
  const span = Math.max(max - min, 1e-5);
  const order = new Float32Array(count);

  if (perSegment) {
    for (let i = 0; i < count; i += 2) {
      const next = Math.min(i + 1, count - 1);
      const t = ((position.getY(i) + position.getY(next)) / 2 - min) / span;
      const value = Math.min(1, Math.max(0, t + (Math.random() - 0.5) * jitter));
      order[i] = value;
      order[next] = value;
    }
  } else {
    for (let i = 0; i < count; i += 1) {
      const t = (position.getY(i) - min) / span;
      order[i] = Math.min(1, Math.max(0, t + (Math.random() - 0.5) * jitter));
    }
  }

  geometry.setAttribute('aOrder', new THREE.BufferAttribute(order, 1));
  return geometry;
}

/** Adds the aSize / aPhase / aTint attributes consumed by the point shader. */
export function decoratePoints(geometry, { size = 1.2, spread = 0.6, tint = 0.6 } = {}) {
  const count = geometry.getAttribute('position').count;
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const tints = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    sizes[i] = size + Math.random() * spread;
    phases[i] = Math.random() * Math.PI * 2;
    tints[i] = Math.random() * tint;
  }
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aTint', new THREE.BufferAttribute(tints, 1));
  return geometry;
}
