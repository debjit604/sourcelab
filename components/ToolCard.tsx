"use client";

import React from "react";
import Link from "next/link";
import { Tool } from "@/registry/types";
import { getCategoryMeta } from "@/registry/categories";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const catMeta = getCategoryMeta(tool.category);

  return (
    <Link
      href={tool.slug}
      className={`group relative flex flex-col justify-between p-5 rounded-[14px] bg-[var(--sl-surface)] border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,211,238,0.12)] ${
        className || ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
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

      <div className="mt-4 pt-3 border-t border-[var(--sl-border)] flex items-center justify-between text-[11px]">
        {tool.privacy === "client" ? (
          <span className="inline-flex items-center gap-1 text-[var(--sl-success)] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero upload
          </span>
        ) : (
          <span className="text-[var(--sl-warning)] font-mono">Server required</span>
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
