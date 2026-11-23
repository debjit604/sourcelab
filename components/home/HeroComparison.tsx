"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export function HeroComparison() {
  const [position, setPosition] = useState(48); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);

  // Paint procedural visual textures for comparison
  const paintCanvases = useCallback(() => {
    const cBefore = canvasBeforeRef.current;
    const cAfter = canvasAfterRef.current;
    if (!cBefore || !cAfter) return;

    const w = 480;
    const h = 320;
    cBefore.width = w;
    cBefore.height = h;
    cAfter.width = w;
    cAfter.height = h;

    const ctxB = cBefore.getContext("2d");
    const ctxA = cAfter.getContext("2d");
    if (!ctxB || !ctxA) return;

    // Draw background gradients
    const gradB = ctxB.createLinearGradient(0, 0, w, h);
    gradB.addColorStop(0, "#080e1a");
    gradB.addColorStop(1, "#14243b");
    ctxB.fillStyle = gradB;
    ctxB.fillRect(0, 0, w, h);

    const gradA = ctxA.createLinearGradient(0, 0, w, h);
    gradA.addColorStop(0, "#080e1a");
    gradA.addColorStop(1, "#14243b");
    ctxA.fillStyle = gradA;
    ctxA.fillRect(0, 0, w, h);

    // Draw high-resolution crisp geometries on After
    const colors = ["#22D3EE", "#818CF8", "#F472B6", "#34D399"];
    for (let i = 0; i < 18; i++) {
      const bx = (i * 37) % w;
      const by = (i * 53) % h;
      const bw = 60 + (i % 4) * 25;
      const bh = 50 + (i % 3) * 20;

      // Crisp shapes on After
      ctxA.fillStyle = colors[i % colors.length];
      ctxA.globalAlpha = 0.2 + (i % 3) * 0.15;
      ctxA.beginPath();
      ctxA.roundRect(bx, by, bw, bh, 8);
      ctxA.fill();

      // Noisy / heavy uncompressed pixelation on Before
      ctxB.fillStyle = colors[i % colors.length];
      ctxB.globalAlpha = 0.45;
      ctxB.fillRect(bx, by, bw, bh);
    }

    // Add noise grain to Before
    const imgData = ctxB.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let p = 0; p < data.length; p += 4) {
      if (Math.random() < 0.15) {
        data[p] = Math.min(255, data[p] + 45);
        data[p + 1] = Math.min(255, data[p + 1] + 45);
        data[p + 2] = Math.min(255, data[p + 2] + 45);
      }
    }
    ctxB.putImageData(imgData, 0, 0);
  }, []);

  useEffect(() => {
    paintCanvases();
  }, [paintCanvases]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(5, Math.min(95, rawPct));
    setPosition(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3 sm:p-4 rounded-2xl glass-surface shadow-2xl">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none touch-none border border-[var(--sl-border)] bg-[#070A12]"
        aria-label="Drag to compare before and after local compression"
      >
        {/* Layer 1: After (Optimized / Local) */}
        <div className="absolute inset-0">
          <canvas ref={canvasAfterRef} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-[rgba(52,211,153,0.15)] text-[var(--sl-success)] border border-[rgba(52,211,153,0.35)] backdrop-blur-md">
            After · 640 KB
          </span>
        </div>

        {/* Layer 2: Before (Original Heavy File) - Clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <canvas ref={canvasBeforeRef} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-[rgba(251,191,36,0.15)] text-[var(--sl-warning)] border border-[rgba(251,191,36,0.35)] backdrop-blur-md">
            Before · 4.2 MB
          </span>
        </div>

        {/* Drag Handle Divider */}
        <div
          className="absolute top-0 bottom-0 w-0 -translate-x-1/2 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-[#0B0F1A] font-bold text-xs flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            ⇔
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--sl-muted)] mt-3 px-1">
        <span>Drag slider to inspect</span>
        <span className="font-semibold text-[var(--sl-success)]">−85% size, same crisp look</span>
      </div>
    </div>
  );
}
