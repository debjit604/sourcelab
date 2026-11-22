"use client";

import React, { useState } from "react";
import { categoryList } from "@/registry";
import { PlusCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RequestToolPage() {
  const [toolName, setToolName] = useState("");
  const [category, setCategory] = useState("dev");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !description.trim()) return;

    try {
      const existing = window.localStorage.getItem("sourcelab:requests");
      const list = existing ? JSON.parse(existing) : [];
      list.push({
        toolName,
        category,
        description,
        date: new Date().toISOString(),
      });
      window.localStorage.setItem("sourcelab:requests", JSON.stringify(list));
    } catch (err) {
      console.warn("Storage failed:", err);
    }

    setSubmitted(true);
  };

  return (
    <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[rgba(34,211,238,0.1)] text-[var(--sl-accent)] border border-[rgba(34,211,238,0.2)]">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Community Suggestions</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-[var(--sl-text)]">
          Naya Tool Request Karo
        </h1>
        <p className="text-sm md:text-base text-[var(--sl-muted)] leading-relaxed">
          Kya koi tool hai jo tumhe roz chahiye par accha client-side option nahi milta? Humein batao, hum agle wave me banayenge.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[var(--sl-success)] mx-auto" />
          <h2 className="text-xl font-bold text-[var(--sl-text)]">
            Shukriya! Request note kar li gayi hai.
          </h2>
          <p className="text-xs md:text-sm text-[var(--sl-muted)] max-w-md mx-auto">
            Hum client-side viability check karenge aur aane wale tools me isko prioritize karenge.
          </p>
          <Button
            type="button"
            onClick={() => {
              setToolName("");
              setDescription("");
              setSubmitted(false);
            }}
            className="mt-4"
          >
            Ek aur tool suggest karo
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-[var(--sl-surface)] border border-[var(--sl-border)] space-y-5">
          <div className="space-y-2">
            <label htmlFor="tool-name" className="text-xs font-semibold uppercase tracking-wider text-[var(--sl-muted)] font-mono">
              Tool ka Naam
            </label>
            <Input
              id="tool-name"
              type="text"
              required
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. SVG to WebP Converter, Audio Noise Reducer..."
              className="bg-[var(--sl-bg)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tool-category" className="text-xs font-semibold uppercase tracking-wider text-[var(--sl-muted)] font-mono">
              Category
            </label>
            <select
              id="tool-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--sl-bg)] border border-[var(--sl-border)] text-[var(--sl-text)] text-sm focus:outline-none focus:border-[var(--sl-accent)] font-sans"
            >
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="tool-desc" className="text-xs font-semibold uppercase tracking-wider text-[var(--sl-muted)] font-mono">
              Ye tool kya karega? (Details)
            </label>
            <Textarea
              id="tool-desc"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Input kya hoga, output kya chahiye, koi specific options ya formats..."
              className="bg-[var(--sl-bg)] resize-y"
            />
          </div>

          <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.2)] flex items-center gap-2.5 text-xs text-[var(--sl-success)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Kewal wahi tools accept honge jo 100% browser-side chal sakte hain.</span>
          </div>

          <Button type="submit" className="w-full">
            Request Submit Karo
          </Button>
        </form>
      )}
    </main>
  );
}
