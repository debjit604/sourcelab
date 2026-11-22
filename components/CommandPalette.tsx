"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchTools, getToolById, popularTools } from "@/registry";
import { getCategoryMeta } from "@/registry/categories";
import { useRecent } from "@/hooks/useRecent";
import { Tool } from "@/registry/types";
import { Search, Clock, ArrowRight, X, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { recent } = useRecent();

  const openPalette = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Compute displayed tool list
  const getResults = useCallback((): Tool[] => {
    if (!query.trim()) {
      if (recent.length > 0) {
        const recentTools = recent
          .map((id) => getToolById(id))
          .filter((t): t is Tool => Boolean(t));
        if (recentTools.length > 0) return recentTools;
      }
      return popularTools(8);
    }
    return searchTools(query);
  }, [query, recent]);

  const results = getResults();

  // Open/close listeners: Ctrl+K, '/', and custom event 'sl:open-palette'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === "/" && !isInput && !isOpen) {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    const handleCustomOpen = () => openPalette();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("sl:open-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("sl:open-palette", handleCustomOpen);
    };
  }, [isOpen, openPalette, closePalette]);

  // Handle arrow key navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedTool = results[selectedIndex];
      if (selectedTool) {
        closePalette();
        router.push(selectedTool.slug);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tool search command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-sm"
      onClick={closePalette}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          role="combobox"
          aria-expanded="true"
          aria-haspopup="listbox"
          aria-controls="sl-palette-list"
          className="flex items-center px-4 py-3.5 border-b border-[var(--sl-border)] gap-3 bg-[var(--sl-surface)]"
        >
          <Search className="w-5 h-5 text-[var(--sl-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyNavigation}
            placeholder="Search tools... (e.g. 'json format', 'base64')"
            style={{ fontSize: "16px" }} // iOS zoom prevention
            className="flex-1 bg-transparent text-[var(--sl-text)] placeholder:text-[var(--sl-muted)] outline-none border-none font-sans"
            aria-autocomplete="list"
            aria-controls="sl-palette-list"
            aria-activedescendant={
              results[selectedIndex] ? `palette-item-${results[selectedIndex].id}` : undefined
            }
          />
          <button
            type="button"
            onClick={closePalette}
            aria-label="Close palette"
            className="p-1 rounded-lg text-[var(--sl-muted)] hover:text-[var(--sl-text)] hover:bg-[var(--sl-border)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {!query && (
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--sl-muted)] flex items-center gap-1.5">
              {recent.length > 0 ? (
                <>
                  <Clock className="w-3 h-3 text-[var(--sl-accent)]" />
                  <span>Haal hi me khole gaye (Recent)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-[var(--sl-accent)]" />
                  <span>Popular Tools</span>
                </>
              )}
            </div>
          )}

          {results.length > 0 ? (
            <ul id="sl-palette-list" role="listbox" ref={listRef} className="space-y-1">
              {results.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const catMeta = getCategoryMeta(tool.category);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const IconComp = (Icons as any)[
                  tool.icon
                    .split("-")
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join("")
                ] || Icons.Wrench;

                return (
                  <li
                    id={`palette-item-${tool.id}`}
                    key={tool.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      closePalette();
                      router.push(tool.slug);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[rgba(34,211,238,0.1)] text-[var(--sl-text)] border border-[rgba(34,211,238,0.3)]"
                        : "text-[var(--sl-muted)] hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{
                          backgroundColor: `${catMeta.color}20`,
                          color: catMeta.color,
                        }}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--sl-text)] truncate">
                            {tool.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--sl-border)] text-[var(--sl-muted)] shrink-0">
                            {catMeta.name}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--sl-muted)] truncate">{tool.tagline}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-opacity ${
                        isSelected ? "opacity-100 text-[var(--sl-accent)]" : "opacity-0"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm text-[var(--sl-muted)]">
                Koi tool nahi mila: &quot;{query}&quot;
              </p>
              <p className="text-xs text-[var(--sl-muted)]">
                Kuch naya chahiye?{" "}
                <Link
                  href="/request-tool"
                  onClick={closePalette}
                  className="text-[var(--sl-accent)] hover:underline font-medium"
                >
                  Request a tool →
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 border-t border-[var(--sl-border)] bg-[rgba(0,0,0,0.2)] flex items-center justify-between text-[11px] text-[var(--sl-muted)] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[var(--sl-accent)]">Zero upload • 100% Client-side</span>
        </div>
      </div>
    </div>
  );
}
