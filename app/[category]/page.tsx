import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categoryList, getCategoryMeta, toolsByCategory } from "@/registry";
import { Category } from "@/registry/types";
import { ToolCard } from "@/components/ToolCard";
import { ChevronRight, Sparkles, Plus } from "lucide-react";
import * as Icons from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categoryList.map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category as Category);

  return {
    title: `${meta.name} Online, Free | SourceLab`,
    description: `${meta.tagline}. 100% private client-side browser tools without uploads.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catMeta = getCategoryMeta(category as Category);

  if (!categoryList.some((c) => c.id === category)) {
    notFound();
  }

  const tools = toolsByCategory(category as Category);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CatIcon = (Icons as any)[
    catMeta.icon
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("")
  ] || Icons.Wrench;

  return (
    <main className="w-full max-w-[var(--max-w-home)] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--sl-muted)] font-mono">
        <Link href="/" className="hover:text-[var(--sl-accent)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--sl-text)] font-semibold">{catMeta.name}</span>
      </nav>

      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--sl-border)]">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
            style={{
              backgroundColor: `${catMeta.color}18`,
              color: catMeta.color,
            }}
          >
            <CatIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--sl-text)]">
              {catMeta.name}
            </h1>
            <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-1">
              {catMeta.tagline}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--sl-muted)] px-3 py-1.5 rounded-lg bg-[var(--sl-surface)] border border-[var(--sl-border)] self-start sm:self-auto">
          {tools.length} {tools.length === 1 ? "tool live" : "tools live"}
        </div>
      </div>

      {/* Tools Grid or Empty State */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 rounded-2xl bg-[var(--sl-surface)] border border-dashed border-[var(--sl-border)]">
          <div className="p-3 rounded-full bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[var(--sl-text)]">
              Jald aa raha hai!
            </h2>
            <p className="text-sm text-[var(--sl-muted)] max-w-md">
              Is category ke tools abhi development me hain. Koi specific tool chahiye? Humein batao!
            </p>
          </div>
          <Link
            href="/request-tool"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--sl-accent)] text-slate-950 font-medium text-xs hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Request a Tool</span>
          </Link>
        </div>
      )}
    </main>
  );
}
