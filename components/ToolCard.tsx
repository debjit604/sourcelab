"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Tool } from "@/registry/types";
import { getCategoryMeta } from "@/registry/categories";
import { ShieldCheck, ArrowUpRight, Globe } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const catMeta = getCategoryMeta(tool.category);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState("");
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotX = ((0.5 - y / rect.height) * 10).toFixed(2);
    const rotY = ((x / rect.width - 0.5) * 10).toFixed(2);

    setTransform(`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`);
    setSpotlight({ x, y, active: true });
  };

  const handlePointerLeave = () => {
    setTransform("");
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <Link
      ref={cardRef}
      href={tool.slug}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transform, transition: transform ? "transform 0.1s ease-out" : "transform 0.35s ease-out" }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl glass-surface border border-[var(--sl-border)] hover:border-[var(--sl-accent)] hover:shadow-[0_16px_36px_-12px_rgba(34,211,238,0.2)] overflow-hidden ${
        className || ""
      }`}
    >
      {/* Radial Spotlight Follower */}
      {spotlight.active && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, rgba(34,211,238,0.12), transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            style={{
              backgroundColor: `${catMeta.color}18`,
              color: catMeta.color,
            }}
          >
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--sl-muted)] group-hover:text-[var(--sl-accent)] transition-colors">
            <span className="font-mono">{catMeta.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <h3 className="text-base font-semibold text-[var(--sl-text)] group-hover:text-[var(--sl-accent)] transition-colors line-clamp-1">
          {tool.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--sl-muted)] line-clamp-2 leading-relaxed">
          {tool.tagline}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--sl-border)] flex items-center justify-between text-[11px] relative z-10">
        {tool.privacy === "client" ? (
          <span className="inline-flex items-center gap-1 text-[var(--sl-success)] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero upload
          </span>
        ) : tool.privacy === "third-party" ? (
          <span className="inline-flex items-center gap-1 text-[var(--sl-accent)] font-mono">
            <Globe className="w-3.5 h-3.5" />
            DoH resolver
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[var(--sl-warning)] font-mono">
            <Globe className="w-3.5 h-3.5" />
            Server (10m TTL)
          </span>
        )}
        {tool.heavy && (
          <span className="text-[var(--sl-muted)] font-mono">
            {tool.modelSizeMB ? `${tool.modelSizeMB}MB` : "Heavy"}
          </span>
        )}
      </div>
    </Link>
  );
}
