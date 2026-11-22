"use client";

import React, { useState } from "react";
import { useRecent } from "@/hooks/useRecent";
import { useFavorites } from "@/hooks/useFavorites";
import { getToolById } from "@/registry";
import { ToolCard } from "./ToolCard";
import { Clock, Star } from "lucide-react";

export function RecentAndFavs() {
  const { recent } = useRecent();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<"recent" | "favs">("recent");

  const recentTools = recent
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const favoriteTools = favorites
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // If both empty, don't show the section
  if (recentTools.length === 0 && favoriteTools.length === 0) {
    return null;
  }

  const displayedTools = activeTab === "recent" ? recentTools : favoriteTools;

  return (
    <section id="favorites" className="w-full space-y-4 pt-4">
      <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
        <div className="flex items-center gap-2">
          {recentTools.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "recent"
                  ? "bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.3)]"
                  : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Haal hi me use kiye ({recentTools.length})</span>
            </button>
          )}

          {favoriteTools.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("favs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "favs"
                  ? "bg-[rgba(251,191,36,0.15)] text-[var(--sl-warning)] border border-[rgba(251,191,36,0.3)]"
                  : "text-[var(--sl-muted)] hover:text-[var(--sl-text)]"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Starred Tools ({favoriteTools.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
