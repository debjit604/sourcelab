import React from "react";
import Link from "next/link";
import { categoryList, toolsByCategory, popularTools, newTools, liveTools } from "@/registry";
import { ToolCard } from "@/components/ToolCard";
import { SearchTrigger } from "@/components/SearchTrigger";
import { RecentAndFavs } from "@/components/RecentAndFavs";
import { ShieldCheck, Zap, WifiOff, Sparkles, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

export default function HomePage() {
  const popular = popularTools(8);
  const newlyAdded = newTools(8);
  const liveCount = liveTools().length;

  return (
    <main className="w-full max-w-[var(--max-w-home)] mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-8 pt-4 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--sl-border)] bg-[var(--sl-surface)] text-xs text-[var(--sl-accent)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--sl-accent)] animate-pulse" />
          <span className="font-mono font-medium">Privacy-First Browser Toolbox • {liveCount}+ Tools</span>
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading text-[var(--sl-text)] leading-tight">
            Tumhari file tumhare browser me hi process hoti hai{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--sl-accent)] to-blue-500">
              — server pe kabhi nahi jaati.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--sl-muted)] leading-relaxed">
            Free, no-signup browser tools for developers, designers, aur daily users.
            Zero cloud uploads, full offline support, unlimited private processing.
          </p>
        </div>

        {/* Big Search Trigger */}
        <div className="w-full flex justify-center pt-2">
          <SearchTrigger />
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-left">
            <ShieldCheck className="w-4 h-4 text-[var(--sl-success)] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--sl-text)] truncate">Zero Uploads</p>
              <p className="text-[11px] text-[var(--sl-muted)] truncate">100% local in browser</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-left">
            <Zap className="w-4 h-4 text-[var(--sl-accent)] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--sl-text)] truncate">Instant Speed</p>
              <p className="text-[11px] text-[var(--sl-muted)] truncate">No queue, zero lag</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-left">
            <WifiOff className="w-4 h-4 text-[var(--sl-warning)] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--sl-text)] truncate">Works Offline</p>
              <p className="text-[11px] text-[var(--sl-muted)] truncate">PWA ready toolkit</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-left">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--sl-text)] truncate">100% Free</p>
              <p className="text-[11px] text-[var(--sl-muted)] truncate">No watermark, no limit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent & Starred (Client Component) */}
      <RecentAndFavs />

      {/* Category Grid Section */}
      <section id="categories" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--sl-text)]">
              Categories
            </h2>
            <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-0.5">
              Sabhi toolkit categories browser ke andar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryList.map((cat) => {
            const count = toolsByCategory(cat.id).length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const CatIcon = (Icons as any)[
              cat.icon
                .split("-")
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join("")
            ] || Icons.Wrench;

            return (
              <Link
                key={cat.id}
                href={`/${cat.id}`}
                className="group relative flex flex-col justify-between p-5 rounded-[14px] bg-[var(--sl-surface)] border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(34,211,238,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{
                        backgroundColor: `${cat.color}18`,
                        color: cat.color,
                      }}
                    >
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-[var(--sl-muted)]">
                      {count > 0 ? `${count} tools` : "Coming soon"}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[var(--sl-text)] group-hover:text-[var(--sl-accent)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--sl-muted)] line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--sl-border)] flex items-center justify-between text-xs text-[var(--sl-accent)]">
                  <span>Explore tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Tools Section */}
      {popular.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
                <span>🔥 Sabse zyada use hone wale</span>
              </h2>
              <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-0.5">
                Top rated tools jo users sabse zyada chalate hain
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popular.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* New Tools Section */}
      {newlyAdded.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--sl-text)] flex items-center gap-2">
                <span>✨ Naye tools</span>
              </h2>
              <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-0.5">
                SourceLab me naye jode gaye fresh utilities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newlyAdded.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
