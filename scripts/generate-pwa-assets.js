import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Non-interlaced
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // Filter: None
    rgbaBuffer.copy(
      rawData,
      y * scanlineLength + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Math helpers
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Draw modern Zaki Code App Icon
function renderZakiIcon(width, height, isMaskable = false) {
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height);
  const scale = isMaskable ? 0.75 : 0.9; // Safe zone padding for maskable icons

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: Deep obsidian navy (#020617 to #0f172a)
      const gradT = clamp((y / height) * 0.7 + (x / width) * 0.3, 0, 1);
      let r = lerp(2, 15, gradT);
      let g = lerp(6, 23, gradT);
      let b = lerp(23, 42, gradT);
      let a = 255;

      // Subtle ambient glowing halo in upper center
      const glowDist = Math.sqrt(dx * dx + (dy + size * 0.1) * (dy + size * 0.1));
      const glowRadius = size * 0.55 * scale;
      if (glowDist < glowRadius) {
        const glowFactor = Math.pow(1 - glowDist / glowRadius, 2) * 0.35;
        r += 245 * glowFactor;
        g += 158 * glowFactor;
        b += 11 * glowFactor;
      }

      // Rounded squircle container for non-maskable icon
      if (!isMaskable) {
        const sqRadius = size * 0.44;
        const cornerR = size * 0.18;
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        const qx = Math.max(0, ax - (sqRadius - cornerR));
        const qy = Math.max(0, ay - (sqRadius - cornerR));
        const cornerDist = Math.sqrt(qx * qx + qy * qy);

        if (cornerDist > cornerR) {
          // Outside squircle: transparent
          buffer[idx] = 0;
          buffer[idx + 1] = 0;
          buffer[idx + 2] = 0;
          buffer[idx + 3] = 0;
          continue;
        }

        // Inner glowing border
        if (cornerDist > cornerR - 2 || (ax > sqRadius - 2 && ay < sqRadius - cornerR) || (ay > sqRadius - 2 && ax < sqRadius - cornerR)) {
          r = lerp(r, 245, 0.4);
          g = lerp(g, 158, 0.4);
          b = lerp(b, 11, 0.4);
        }
      }

      // Center Geometric Code Emblem: `< / >` + Cyber Pyramid Core
      const nx = dx / (size * scale);
      const ny = dy / (size * scale);

      // 1. Left Bracket `<`
      // Lines: from (-0.28, -0.22) to (-0.38, 0) to (-0.28, 0.22)
      const dLeftTop = distToSegment(nx, ny, -0.25, -0.24, -0.38, 0);
      const dLeftBottom = distToSegment(nx, ny, -0.38, 0, -0.25, 0.24);
      const minDLeft = Math.min(dLeftTop, dLeftBottom);

      // 2. Right Bracket `>`
      const dRightTop = distToSegment(nx, ny, 0.25, -0.24, 0.38, 0);
      const dRightBottom = distToSegment(nx, ny, 0.38, 0, 0.25, 0.24);
      const minDRight = Math.min(dRightTop, dRightBottom);

      // 3. Center Slash `/`
      const dSlash = distToSegment(nx, ny, 0.08, -0.26, -0.08, 0.26);

      // 4. Center Golden Core Star / Pyramid Diamond
      const diamondDist = Math.abs(nx) + Math.abs(ny);

      const strokeThickness = 0.045;

      // Render Center Diamond (Glowing Core)
      if (diamondDist < 0.12) {
        const coreFactor = 1 - diamondDist / 0.12;
        r = 255;
        g = lerp(180, 240, coreFactor);
        b = lerp(50, 180, coreFactor);
      }

      // Render Brackets (Amber Gold Gradient: #f59e0b to #fb923c)
      if (minDLeft < strokeThickness) {
        const t = (ny + 0.24) / 0.48;
        const blend = 1 - minDLeft / strokeThickness;
        r = lerp(r, lerp(251, 245, t), blend);
        g = lerp(g, lerp(146, 158, t), blend);
        b = lerp(b, lerp(60, 11, blend), blend);
      }

      if (minDRight < strokeThickness) {
        const t = (ny + 0.24) / 0.48;
        const blend = 1 - minDRight / strokeThickness;
        r = lerp(r, lerp(245, 251, t), blend);
        g = lerp(g, lerp(158, 146, t), blend);
        b = lerp(b, lerp(11, 60, blend), blend);
      }

      // Render Slash (Electric Cyan / Gold: #38bdf8 to #f59e0b)
      if (dSlash < strokeThickness * 0.9) {
        const t = clamp((ny + 0.26) / 0.52, 0, 1);
        const blend = 1 - dSlash / (strokeThickness * 0.9);
        r = lerp(r, lerp(56, 245, t), blend);
        g = lerp(g, lerp(189, 158, t), blend);
        b = lerp(b, lerp(248, 11, t), blend);
      }

      buffer[idx] = clamp(Math.round(r), 0, 255);
      buffer[idx + 1] = clamp(Math.round(g), 0, 255);
      buffer[idx + 2] = clamp(Math.round(b), 0, 255);
      buffer[idx + 3] = clamp(Math.round(a), 0, 255);
    }
  }

  return buffer;
}

// Distance from point (px, py) to line segment (x1, y1)-(x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);
  return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
}

// Draw Full PWA Mobile Splash Screen (Portrait 1080x1920)
function renderMobileSplash(width, height) {
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height * 0.42; // Center logo slightly above middle

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Dark background gradient
      const bgT = y / height;
      let r = lerp(2, 10, bgT);
      let g = lerp(6, 15, bgT);
      let b = lerp(23, 35, bgT);
      let a = 255;

      // Ambient radial lighting behind logo
      const glowR = width * 0.45;
      if (dist < glowR) {
        const glowFactor = Math.pow(1 - dist / glowR, 2) * 0.4;
        r += 245 * glowFactor;
        g += 158 * glowFactor;
        b += 11 * glowFactor;
      }

      // Center Icon in splash
      const iconSize = width * 0.28;
      const ix = dx / iconSize;
      const iy = dy / iconSize;
      const idist = Math.sqrt(ix * ix + iy * iy);

      if (idist < 1.0) {
        // Left Bracket `<`
        const dL1 = distToSegment(ix, iy, -0.28, -0.25, -0.42, 0);
        const dL2 = distToSegment(ix, iy, -0.42, 0, -0.28, 0.25);
        const minL = Math.min(dL1, dL2);

        // Right Bracket `>`
        const dR1 = distToSegment(ix, iy, 0.28, -0.25, 0.42, 0);
        const dR2 = distToSegment(ix, iy, 0.42, 0, 0.28, 0.25);
        const minR = Math.min(dR1, dR2);

        // Slash `/`
        const dSlash = distToSegment(ix, iy, 0.09, -0.3, -0.09, 0.3);

        const stroke = 0.055;

        // Golden Core
        const diamond = Math.abs(ix) + Math.abs(iy);
        if (diamond < 0.15) {
          const coreT = 1 - diamond / 0.15;
          r = 255;
          g = lerp(190, 245, coreT);
          b = lerp(50, 200, coreT);
        }

        if (minL < stroke) {
          const blend = 1 - minL / stroke;
          r = lerp(r, 245, blend);
          g = lerp(g, 158, blend);
          b = lerp(b, 11, blend);
        }

        if (minR < stroke) {
          const blend = 1 - minR / stroke;
          r = lerp(r, 251, blend);
          g = lerp(g, 146, blend);
          b = lerp(b, 60, blend);
        }

        if (dSlash < stroke * 0.9) {
          const blend = 1 - dSlash / (stroke * 0.9);
          r = lerp(r, 56, blend);
          g = lerp(g, 189, blend);
          b = lerp(b, 248, blend);
        }
      }

      // Splash bottom loading bar pill
      const barY = height * 0.75;
      const barW = width * 0.45;
      const barH = 6;
      if (y >= barY && y <= barY + barH && x >= cx - barW / 2 && x <= cx + barW / 2) {
        const progressT = (x - (cx - barW / 2)) / barW;
        if (progressT < 0.65) {
          // Filled amber gradient
          r = lerp(245, 251, progressT / 0.65);
          g = lerp(158, 146, progressT / 0.65);
          b = 11;
        } else {
          // Unfilled slate
          r = 30;
          g = 41;
          b = 59;
        }
      }

      buffer[idx] = clamp(Math.round(r), 0, 255);
      buffer[idx + 1] = clamp(Math.round(g), 0, 255);
      buffer[idx + 2] = clamp(Math.round(b), 0, 255);
      buffer[idx + 3] = clamp(Math.round(a), 0, 255);
    }
  }

  return buffer;
}

// Draw Full PWA Landscape Splash Screen (1920x1080)
function renderLandscapeSplash(width, height) {
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height * 0.45;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const bgT = y / height;
      let r = lerp(2, 12, bgT);
      let g = lerp(6, 18, bgT);
      let b = lerp(23, 40, bgT);
      let a = 255;

      const glowR = height * 0.55;
      if (dist < glowR) {
        const glowFactor = Math.pow(1 - dist / glowR, 2) * 0.45;
        r += 245 * glowFactor;
        g += 158 * glowFactor;
        b += 11 * glowFactor;
      }

      const iconSize = height * 0.26;
      const ix = dx / iconSize;
      const iy = dy / iconSize;
      const idist = Math.sqrt(ix * ix + iy * iy);

      if (idist < 1.0) {
        const dL1 = distToSegment(ix, iy, -0.28, -0.25, -0.42, 0);
        const dL2 = distToSegment(ix, iy, -0.42, 0, -0.28, 0.25);
        const minL = Math.min(dL1, dL2);

        const dR1 = distToSegment(ix, iy, 0.28, -0.25, 0.42, 0);
        const dR2 = distToSegment(ix, iy, 0.42, 0, 0.28, 0.25);
        const minR = Math.min(dR1, dR2);

        const dSlash = distToSegment(ix, iy, 0.09, -0.3, -0.09, 0.3);
        const stroke = 0.055;

        const diamond = Math.abs(ix) + Math.abs(iy);
        if (diamond < 0.15) {
          const coreT = 1 - diamond / 0.15;
          r = 255;
          g = lerp(190, 245, coreT);
          b = lerp(50, 200, coreT);
        }

        if (minL < stroke) {
          const blend = 1 - minL / stroke;
          r = lerp(r, 245, blend);
          g = lerp(g, 158, blend);
          b = lerp(b, 11, blend);
        }

        if (minR < stroke) {
          const blend = 1 - minR / stroke;
          r = lerp(r, 251, blend);
          g = lerp(g, 146, blend);
          b = lerp(b, 60, blend);
        }

        if (dSlash < stroke * 0.9) {
          const blend = 1 - dSlash / (stroke * 0.9);
          r = lerp(r, 56, blend);
          g = lerp(g, 189, blend);
          b = lerp(b, 248, blend);
        }
      }

      buffer[idx] = clamp(Math.round(r), 0, 255);
      buffer[idx + 1] = clamp(Math.round(g), 0, 255);
      buffer[idx + 2] = clamp(Math.round(b), 0, 255);
      buffer[idx + 3] = clamp(Math.round(a), 0, 255);
    }
  }

  return buffer;
}

// Generate all files
const iconsDir = path.resolve('public/icons');
const splashDir = path.resolve('public/splash');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(splashDir)) fs.mkdirSync(splashDir, { recursive: true });

console.log('Generating high-resolution PWA icons and splash screens...');

// 1. 512x512 standard icon
const icon512 = renderZakiIcon(512, 512, false);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), encodePNG(512, 512, icon512));

// 2. 512x512 maskable icon (padded safe zone)
const iconMaskable512 = renderZakiIcon(512, 512, true);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), encodePNG(512, 512, iconMaskable512));

// 3. 192x192 standard icon
const icon192 = renderZakiIcon(192, 192, false);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), encodePNG(192, 192, icon192));

// 4. 192x192 maskable icon
const iconMaskable192 = renderZakiIcon(192, 192, true);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), encodePNG(192, 192, iconMaskable192));

// 5. 180x180 Apple Touch Icon
const icon180 = renderZakiIcon(180, 180, false);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), encodePNG(180, 180, icon180));
// Also write to /apple-touch-icon.png for root crawlers
fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), encodePNG(180, 180, icon180));

// 6. Favicon 64x64 & 32x32
const icon64 = renderZakiIcon(64, 64, false);
fs.writeFileSync(path.join(iconsDir, 'favicon.png'), encodePNG(64, 64, icon64));

// 7. Splash screens
console.log('Generating mobile and desktop splash screens...');
const splashPortrait = renderMobileSplash(750, 1334);
fs.writeFileSync(path.join(splashDir, 'splash-portrait.png'), encodePNG(750, 1334, splashPortrait));
fs.writeFileSync(path.join(splashDir, 'apple-splash-portrait.png'), encodePNG(750, 1334, splashPortrait));

const splashLandscape = renderLandscapeSplash(1280, 720);
fs.writeFileSync(path.join(splashDir, 'splash-landscape.png'), encodePNG(1280, 720, splashLandscape));
fs.writeFileSync(path.join(splashDir, 'apple-splash-landscape.png'), encodePNG(1280, 720, splashLandscape));

console.log('All PWA icons and splash screens generated successfully!');
