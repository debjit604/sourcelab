import React from "react";
import Link from "next/link";
import { popularTools } from "@/registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchTrigger } from "@/components/SearchTrigger";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const popular = popularTools(4);

  return (
    <main className="w-full max-w-[var(--max-w-home)] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center space-y-12">
      <div className="flex flex-col items-center space-y-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(248,113,113,0.1)] text-[var(--sl-error)] border border-[rgba(248,113,113,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Page nahi mila (404)
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          Shayad galat URL type kiya hai ya tool ka address badal gaya hai. Niche search karke dekho:
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SearchTrigger />
      </div>

      <div className="pt-8 border-t border-[var(--sl-border)] space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-[var(--sl-text)]">
            🔥 Popular Tools try karo
          </h2>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--sl-accent)] hover:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home par jao</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </main>
  );
}
