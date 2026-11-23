"use client";

import React from "react";
import Link from "next/link";
import { Tool } from "@/registry/types";
import { ToolIcon } from "@/components/ToolIcon";

interface MarqueeProps {
  tools: Tool[];
}

export function Marquee({ tools }: MarqueeProps) {
  if (!tools || tools.length === 0) return null;

  // Duplicate list once to create continuous seamless marquee loop
  const displayList = [...tools, ...tools];

  return (
    <div className="w-full overflow-hidden py-3 border-y border-[var(--sl-border)] bg-[var(--sl-surface)]/50 backdrop-blur-xs select-none">
      <div className="animate-marquee gap-3">
        {displayList.map((tool, idx) => (
          <Link
            key={`${tool.id}-${idx}`}
            href={tool.slug}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--sl-bg)] border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-colors group shrink-0"
          >
            <span className="text-[var(--sl-accent)] group-hover:scale-110 transition-transform">
              <ToolIcon name={tool.icon} className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-medium text-[var(--sl-text)] group-hover:text-[var(--sl-accent)]">
              {tool.name}
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--sl-surface)] text-[var(--sl-muted)]">
              {tool.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
