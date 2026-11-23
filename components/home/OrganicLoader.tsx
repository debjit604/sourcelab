"use client";

import React, { useEffect, useRef, useState } from "react";

export function OrganicLoader() {
  const [mounted, setMounted] = useState(false);
  const [dissolved, setDissolved] = useState(false);
  const [progress, setProgress] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run if not already shown in current session
    if (typeof window !== "undefined" && sessionStorage.getItem("sl_loader_shown")) {
      const t = setTimeout(() => setDissolved(true), 0);
      return () => clearTimeout(t);
    }

    const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      sessionStorage.setItem("sl_loader_shown", "1");
      const t = setTimeout(() => setDissolved(true), 0);
      return () => clearTimeout(t);
    }

    const mountTimer = setTimeout(() => setMounted(true), 0);

    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    if (!canvas || !loader) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Seeded multi-frequency organic blob generator
    const seedA = Math.random() * 6.28;
    const seedB = Math.random() * 6.28;
    const seedC = Math.random() * 6.28;

    const getBlobPoints = (cx: number, cy: number, t: number, maxR: number) => {
      const segs = 56;
      const pts: [number, number][] = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const r =
          t *
          maxR *
          (1 +
            0.18 * Math.sin(a * 3 + seedA) +
            0.12 * Math.sin(a * 5 + seedB) +
            0.07 * Math.sin(a * 7 + seedC));
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return pts;
    };

    const pointsToPathD = (pts: [number, number][]) => {
      return (
        pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") +
        " Z"
      );
    };

    // Phase 1: Progress counting
    const duration = 1400;
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        // Start organic burn dissolve transition
        startBurnDissolve();
      }
    };

    animId = requestAnimationFrame(updateProgress);

    // Phase 2: Procedural burn dissolve
    const startBurnDissolve = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh * 0.45;
      const maxRadius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.25;

      const burnDuration = 1000;
      const burnStart = performance.now();

      const burnStep = (now: number) => {
        const lin = Math.min(1, (now - burnStart) / burnDuration);
        const ease = 1 - Math.pow(1 - lin, 3);
        const pts = getBlobPoints(cx, cy, ease, maxRadius);
        const pathD = pointsToPathD(pts);

        // Cut through loader stage
        loader.style.clipPath = `path(evenodd, "M0,0H${vw}V${vh}H0Z ${pathD}")`;

        // Render glowing ember burning edge
        ctx.clearRect(0, 0, vw, vh);
        const warm = lin;
        const r = Math.round(34 + warm * 220);
        const g = Math.round(211 - warm * 150);
        const b = Math.round(238 - warm * 205);

        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.95)`;
        ctx.lineWidth = 8;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx.shadowBlur = 32;
        ctx.stroke();

        if (lin < 1) {
          animId = requestAnimationFrame(burnStep);
        } else {
          sessionStorage.setItem("sl_loader_shown", "1");
          setDissolved(true);
        }
      };

      animId = requestAnimationFrame(burnStep);
    };

    return () => {
      clearTimeout(mountTimer);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (dissolved || !mounted) return null;

  const word = "SOURCELAB";

  return (
    <>
      <div
        ref={loaderRef}
        id="loader-stage"
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050710] select-none pointer-events-auto"
      >
        {/* Glowing HorizonX Petals / Generating Orb */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 mb-6">
          <div className="absolute inset-0 rounded-full blur-xl opacity-70 bg-gradient-to-tr from-cyan-400 via-indigo-600 to-pink-500 animate-pulse" />
          <div className="relative w-full h-full rounded-full border border-cyan-400/30 flex items-center justify-center p-3">
            <svg
              className="w-16 h-16 md:w-20 md:h-20 animate-spin text-[var(--sl-accent)] drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]"
              style={{ animationDuration: "12s" }}
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16 2l12 7v14l-12 7L4 23V9z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 12.5c0-1.4 1.8-2.5 4-2.5s4 .9 4 2.2-1.4 1.9-4 2.6-4 1.3-4 2.7 1.8 2.5 4 2.5 4-1.1 4-2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Staggered Pulsing Letters */}
        <div className="flex gap-1.5 font-heading font-bold text-sm md:text-base tracking-[0.35em] text-white uppercase mb-4 pl-1">
          {word.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block animate-pulse"
              style={{
                animationDelay: `${i * 90}ms`,
                animationDuration: "1.4s",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-48 md:w-56 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--sl-accent)] via-purple-500 to-pink-500 shadow-[0_0_12px_var(--sl-accent)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="absolute right-6 bottom-5 font-mono text-[11px] text-white/30 tracking-widest uppercase">
          SourceLab • Privacy Suite
        </div>
      </div>

      {/* Burn Dissolve Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[998] pointer-events-none"
      />
    </>
  );
}
