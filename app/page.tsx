import React from "react";
import Link from "next/link";
import { categoryList, toolsByCategory, popularTools, newTools, liveTools } from "@/registry";
import { ToolCard } from "@/components/ToolCard";
import { RecentAndFavs } from "@/components/RecentAndFavs";
import { Marquee } from "@/components/home/Marquee";
import { SecurityLab } from "@/components/home/SecurityLab";
import { HeroSpatial } from "@/components/home/HeroSpatial";
import { HowItWorksTerminal } from "@/components/home/HowItWorksTerminal";
import { WhyBento } from "@/components/home/WhyBento";
import { OrganicLoader } from "@/components/home/OrganicLoader";
import { ArrowRight, Sparkles } from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";

export default function HomePage() {
  const allLive = liveTools();
  const popular = popularTools(8);
  const newlyAdded = newTools(8);
  const liveCount = allLive.length;

  return (
    <>
      {/* High-Fidelity Organic Entrance Loader & Burn Dissolve Transition */}
      <OrganicLoader />

      <main className="w-full max-w-[var(--max-w-home)] mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-16">
        {/* Spatial UI Hero with 3D Character Reveal & Interactive Comparison Slider */}
        <HeroSpatial totalTools={liveCount} />

        {/* Live Tools Marquee Infinite Ribbon */}
        <Marquee tools={allLive} />

        {/* Security Lab Section with Cyber Scanlines & Honest Privacy Tags */}
        <SecurityLab />

        {/* Recent & Starred (Client Component) */}
        <RecentAndFavs />

        {/* Category Grid Section with Interactive Jump Links */}
        <section id="categories" className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--sl-border)] pb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--sl-text)]">
                Categories
              </h2>
              <p className="text-xs md:text-sm text-[var(--sl-muted)] mt-0.5">
                Sabhi toolkit categories browser ke sandbox ke andar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryList.map((cat) => {
              const count = toolsByCategory(cat.id).length;

              return (
                <Link
                  key={cat.id}
                  href={`/${cat.id}`}
                  data-cat-card={cat.id}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl glass-surface border border-[var(--sl-border)] hover:border-[var(--sl-accent)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(34,211,238,0.12)]"
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
                        <ToolIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-[var(--sl-muted)]">
                        {count > 0 ? `${count} ${count === 1 ? "tool" : "tools"}` : "Coming soon"}
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
                    <span>Explore category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How It Works with Live Interactive Terminal Log */}
        <HowItWorksTerminal />

        {/* Why SourceLab Bento Grid */}
        <WhyBento />

        {/* Popular Tools Section */}
        {popular.length > 0 && (
          <section className="space-y-6 pt-4">
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
          <section className="space-y-6 pt-4">
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

        {/* Request Tool Banner */}
        <section className="pt-4">
          <div className="p-8 sm:p-10 rounded-3xl glass-surface border border-[var(--sl-border)] text-center space-y-4 relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/30 text-[var(--sl-accent)] border border-cyan-800/40">
              <Sparkles className="w-3.5 h-3.5" /> Community Driven Suite
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--sl-text)]">
              Missing a tool? We will build it.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--sl-muted)] max-w-lg mx-auto">
              Agar koi tool list me nahi hai, to humein batao. Hum privacy-first, zero-upload implementation banakar deploy kar denge.
            </p>
            <div className="pt-2">
              <Link
                href="/request-tool"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--sl-accent)] text-[#0B0F1A] font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
              >
                Request a tool →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
