"use client";

import { useEffect, useRef } from "react";

// ── Math helpers ─────────────────────────────────────────────────────────────
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Shape types ───────────────────────────────────────────────────────────────
type ShapeKind = "circle" | "square" | "diamond";

interface GeoShape {
  kind:  ShapeKind;
  cx:    number;  // center x
  cy:    number;  // center y (falling)
  vx:    number;  // tiny horizontal drift
  vy:    number;  // falling speed px/ms
  size:  number;  // radius / half-side
  peak:  number;  // max brightness contribution (above BASE_BRIGHT)
  done:  boolean;
}

// ── Influence of a shape on a single dot ─────────────────────────────────────
// Returns 0–1 factor (feathered, never sharp-edged)
function influence(s: GeoShape, dx: number, dy: number): number {
  const rx = dx - s.cx, ry = dy - s.cy;
  const sz = s.size;

  // Quick AABB reject (1.1× bounding box)
  if (Math.abs(rx) > sz * 1.1 || Math.abs(ry) > sz * 1.1) return 0;

  let t: number;
  switch (s.kind) {
    case "circle": {
      // Radial: very soft centre → zero at edge
      const d = Math.sqrt(rx * rx + ry * ry);
      t = smoothstep(sz, sz * 0.05, d);  // wide soft falloff
      break;
    }
    case "square": {
      // Chebyshev (box) distance — gives soft rectangular glow
      const d = Math.max(Math.abs(rx), Math.abs(ry));
      t = smoothstep(sz, sz * 0.25, d);
      break;
    }
    case "diamond": {
      // Manhattan distance — gives rotated-square (diamond) glow
      const d = Math.abs(rx) + Math.abs(ry);
      t = smoothstep(sz, sz * 0.08, d);
      break;
    }
  }
  return t;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function BrandAccentStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── Tuning (static) ────────────────────────────────────────────────────
    const BASE_BRIGHT = 0.32;
    const PEAK_BRIGHT = 0.72;
    const MOUSE_RAD   = 110;
    const MOUSE_PEAK  = 0.28;
    const BG          = "#2D2D2D";

    // ── Responsive dot params (recalculated on resize) ──────────────────────
    let GAP    = 6;
    let BASE_R = 1.4;
    let MAX_R  = 4.2;

    // Max simultaneous shapes, spawn timing
    const MAX_SHAPES  = 5;
    const SPAWN_MIN   = 500;   // ms between spawns (min)
    const SPAWN_MAX   = 1100;  // ms between spawns (max)

    // Shape size range (as fraction of canvas height)
    const SIZE_MIN    = 0.18;
    const SIZE_MAX    = 0.46;

    // Falling speed px/ms
    const SPD_MIN     = 0.06;
    const SPD_MAX     = 0.18;

    // Horizontal drift ±px/ms
    const DRIFT_MAX   = 0.025;

    // ── Dot state ──────────────────────────────────────────────────────────
    let dots     : Float32Array = new Float32Array(0); // [x0,y0, x1,y1, ...]
    let bright   : Float32Array = new Float32Array(0); // current brightness
    let dotCount = 0;

    // ── Shape state ────────────────────────────────────────────────────────
    let shapes   : GeoShape[] = [];
    let nextSpawn = 0;  // timestamp

    const KINDS: ShapeKind[] = ["circle", "square", "diamond"];

    // ── Build dot grid from text raster ────────────────────────────────────
    const buildDots = () => {
      const W = canvas.width, H = canvas.height;
      if (W < 1 || H < 1) return;

      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      // Impact / Arial Black are universally available bold system fonts
      const FONT_STACK = `Impact, 'Arial Black', Arial, sans-serif`;

      let fs = H * 0.80;
      octx.font = `${fs}px ${FONT_STACK}`;
      while (octx.measureText("SAFESCREEN").width > W * 0.96 && fs > 8) {
        fs -= 2;
        octx.font = `${fs}px ${FONT_STACK}`;
      }
      octx.fillText("SAFESCREEN", W / 2, H / 2);

      const data = octx.getImageData(0, 0, W, H).data;
      const xs: number[] = [], ys: number[] = [];
      for (let y = GAP / 2; y < H; y += GAP)
        for (let x = GAP / 2; x < W; x += GAP)
          if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 128) {
            xs.push(x); ys.push(y);
          }

      // Fallback: if font didn't render, fill the whole canvas with dots
      if (xs.length === 0) {
        for (let y = GAP / 2; y < H; y += GAP)
          for (let x = GAP / 2; x < W; x += GAP) {
            xs.push(x); ys.push(y);
          }
      }

      dotCount = xs.length;
      dots   = new Float32Array(dotCount * 2);
      bright = new Float32Array(dotCount).fill(BASE_BRIGHT);
      for (let i = 0; i < dotCount; i++) {
        dots[i * 2]     = xs[i];
        dots[i * 2 + 1] = ys[i];
      }
      shapes = [];
    };

    // ── Spawn a falling shape ───────────────────────────────────────────────
    const spawn = (W: number, H: number) => {
      if (shapes.length >= MAX_SHAPES) return;
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
      const size = H * (SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN));
      // Spawn horizontally anywhere across canvas width
      const cx = size * 0.5 + Math.random() * (W - size);
      shapes.push({
        kind,
        cx,
        cy:   -size,                                         // start above canvas
        vx:   (Math.random() - 0.5) * 2 * DRIFT_MAX,
        vy:   SPD_MIN + Math.random() * (SPD_MAX - SPD_MIN),
        size,
        peak: 0.38 + Math.random() * 0.24,                  // 0.38–0.62 extra above BASE
        done: false,
      });
    };

    // ── Draw loop ──────────────────────────────────────────────────────────
    let lastTs  = 0;

    const draw = (ts: number) => {
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      const W = canvas.width, H = canvas.height;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Advance shapes
      for (const s of shapes) {
        s.cy += s.vy * dt;
        s.cx += s.vx * dt;
        if (s.cy - s.size > H) s.done = true;
      }
      shapes = shapes.filter(s => !s.done);

      // Spawn
      if (ts >= nextSpawn) {
        spawn(W, H);
        nextSpawn = ts + SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
      }

      // Mouse
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // ── Per-dot brightness update ───────────────────────────────────────
      for (let i = 0; i < dotCount; i++) {
        const dx = dots[i * 2], dy = dots[i * 2 + 1];

        // Sum shape contributions
        let contrib = 0;
        for (const s of shapes) {
          contrib += influence(s, dx, dy) * s.peak;
        }

        // Mouse contribution (radial, smooth)
        const mdx = dx - mx, mdy = dy - my;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        contrib += smoothstep(MOUSE_RAD, 0, mdist) * MOUSE_PEAK;

        const target = Math.min(PEAK_BRIGHT, BASE_BRIGHT + contrib);

        // Asymmetric lerp: snappy rise, slow luminous decay
        const lerp = target > bright[i] ? 0.20 : 0.05;
        bright[i] += (target - bright[i]) * lerp;

        const b = bright[i];
        const v = Math.round(b * 220);
        const r = BASE_R + ((b - BASE_BRIGHT) / (PEAK_BRIGHT - BASE_BRIGHT)) * (MAX_R - BASE_R);

        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.beginPath();
        ctx.arc(dx, dy, Math.max(0.5, r), 0, 6.2832);
        ctx.fill();
      }
    };

    // 50 fps cap
    let raf = 0;
    let accumulator = 0;
    let loopPrev = 0;        // separate from draw's lastTs
    const TARGET_MS = 1000 / 50;

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (loopPrev === 0) loopPrev = ts;  // first frame — no delta
      accumulator += ts - loopPrev;
      loopPrev = ts;
      if (accumulator >= TARGET_MS) {
        accumulator = accumulator % TARGET_MS;
        draw(ts);
      }
    };

    // ── Resize ─────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Scale dot density to canvas width — smaller on mobile
      if (canvas.width < 480) {
        GAP    = 3.5;
        BASE_R = 0.8;
        MAX_R  = 2.4;
      } else if (canvas.width < 768) {
        GAP    = 4.5;
        BASE_R = 1.0;
        MAX_R  = 3.0;
      } else {
        GAP    = 6;
        BASE_R = 1.4;
        MAX_R  = 4.2;
      }

      buildDots();
    };

    // Start loop immediately; buildDots handles 0-size guard internally
    resize();
    raf = requestAnimationFrame(loop);

    // Also rebuild once fonts are ready in case Impact wasn't available yet
    document.fonts.ready.then(() => resize());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="w-full bg-[#2D2D2D]"
      style={{ height: "clamp(160px, 28vw, 340px)" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
