/**
 * logo-trace.js — turns the official Hyper Advance PNG into holographic geometry.
 *
 * No letterforms are re-drawn: the artwork itself is the source of truth.
 *
 *   raster (RGBA)  →  colour classification  →  jittered point samples (dotted faces)
 *                                            →  class-boundary segments (crisp edges)
 *                                            →  normalised world units
 *
 * Classes are the four inks of the brand lockup:
 *   1 globe   (blue disc with its white grid)
 *   2 land    (green Malaysia silhouette)
 *   3 ink     (black A/H monogram)
 *   4 grid    (white graticule inside the globe)
 *
 * The monogram/wordmark lockup is cropped to the emblem automatically: the crop
 * is derived from the globe + land bounding boxes, so the "HYPER ADVANCE" text
 * that sits to the right of the emblem is never sampled.
 */

const NONE = 0;
const GLOBE = 1;
const LAND = 2;
const INK = 3;
const GRID = 4;

/** Scan pitch in source pixels: one hologram dot per cell. */
const POINT_STEP = 2.4;

function classify(r, g, b, a) {
  if (a < 24) return NONE;
  if (g > 95 && g > r + 28 && g > b + 28) return LAND;
  if (b > 118 && b > r + 8 && b > g + 4) return GLOBE;
  if (r < 96 && g < 96 && b < 96) return INK;
  return GRID;
}

/** A class change is worth an edge unless it is the hairline grid against the globe. */
function isMeaningfulBoundary(a, b) {
  if (a === b) return false;
  if (a === NONE || b === NONE) return true;
  if (a === INK || b === INK) return true;
  if (a === LAND || b === LAND) return true;
  return false;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Logo could not be loaded: ${url}`));
    image.src = url;
  });
}

/**
 * @param {string} url  same-origin (or CORS-enabled) logo PNG
 * @param {{ targetHeight?: number }} options
 * @returns {Promise<{ layers: Record<string, { points: number[][], edges: number[] }>,
 *                     width: number, height: number, bounds: object }>}
 */
export async function traceLogo(url, { targetHeight = 18, dpiScale = 1 } = {}) {
  const image = await loadImage(url);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('2D canvas unavailable');
  context.drawImage(image, 0, 0);

  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  const classAt = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return NONE;
    const i = (y * width + x) * 4;
    return classify(data[i], data[i + 1], data[i + 2], data[i + 3]);
  };

  // --- 1. locate the emblem: globe + land bounding boxes -------------------
  let gx0 = Infinity;
  let gx1 = -Infinity;
  let gy0 = Infinity;
  let gy1 = -Infinity;
  let lx0 = Infinity;
  let lx1 = -Infinity;

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const c = classAt(x, y);
      if (c === GLOBE) {
        if (x < gx0) gx0 = x;
        if (x > gx1) gx1 = x;
        if (y < gy0) gy0 = y;
        if (y > gy1) gy1 = y;
      } else if (c === LAND) {
        if (x < lx0) lx0 = x;
        if (x > lx1) lx1 = x;
      }
    }
  }

  if (!Number.isFinite(gx0)) throw new Error('Logo trace found no globe pixels');

  const globeCx = (gx0 + gx1) / 2;
  const globeCy = (gy0 + gy1) / 2;
  const globeR = (gx1 - gx0) / 2;

  // Horizontal window that holds the emblem but stops short of the wordmark,
  // which starts well to the right of the green landmass.
  const winX0 = Math.max(0, Math.min(lx0, gx0) - 10);
  const winX1 = Math.min(width, Math.max(lx1, gx1) + 10);

  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let y = 0; y < height; y += 1) {
    for (let x = winX0; x < winX1; x += 1) {
      if (classAt(x, y) === NONE) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }

  const cropX0 = x0;
  const cropX1 = x1 + 1;
  const cropY0 = y0;
  const cropY1 = y1 + 1;

  const cropW = cropX1 - cropX0;
  const cropH = cropY1 - cropY0;
  const scale = targetHeight / cropH;
  const centerX = (cropX0 + cropX1) / 2;
  const centerY = (cropY0 + cropY1) / 2;

  const toWorld = (px, py) => [(px - centerX) * scale, (centerY - py) * scale];

  // --- 2. dotted faces -----------------------------------------------------
  const layers = {
    globe: { points: [], edges: [] },
    land: { points: [], edges: [] },
    ink: { points: [], edges: [] },
    grid: { points: [], edges: [] },
  };

  const nameOf = { [GLOBE]: 'globe', [LAND]: 'land', [INK]: 'ink', [GRID]: 'grid' };

  for (let gy = cropY0; gy < cropY1; gy += POINT_STEP) {
    for (let gx = cropX0; gx < cropX1; gx += POINT_STEP) {
      const step = POINT_STEP / dpiScale;
      // Jittered lattice: one sample per cell, shifted a little so the scan does
      // not read as a perfect screen-door when the artwork is scaled up.
      const sx = Math.round(gx + (Math.random() - 0.5) * step * 0.45);
      const sy = Math.round(gy + (Math.random() - 0.5) * step * 0.45);
      if (sx < cropX0 || sy < cropY0 || sx >= cropX1 || sy >= cropY1) continue;
      const c = classAt(sx, sy);
      if (c === NONE) continue;
      layers[nameOf[c]].points.push(toWorld(sx, sy));
    }
  }

  // --- 3. class boundaries -------------------------------------------------
  const edgeStep = 1;
  for (let y = cropY0; y < cropY1; y += edgeStep) {
    for (let x = cropX0; x < cropX1; x += edgeStep) {
      const c = classAt(x, y);
      if (c === NONE) continue;
      const right = classAt(x + edgeStep, y);
      const down = classAt(x, y + edgeStep);

      if (isMeaningfulBoundary(c, right)) {
        const a = toWorld(x, y);
        const b = toWorld(x + edgeStep, y);
        layers[nameOf[c]].edges.push(a[0], a[1], b[0], b[1]);
      }
      if (isMeaningfulBoundary(c, down)) {
        const a = toWorld(x, y);
        const b = toWorld(x, y + edgeStep);
        layers[nameOf[c]].edges.push(a[0], a[1], b[0], b[1]);
      }
    }
  }

  return {
    layers,
    width: cropW * scale,
    height: cropH * scale,
    bounds: { x0: toWorld(cropX0, cropY1)[0], x1: toWorld(cropX1, cropY0)[0] },
    globe: { cx: (globeCx - centerX) * scale, cy: (centerY - globeCy) * scale, r: globeR * scale },
  };
}
