import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { liveTools, getToolById } from "@/registry";
import { toolComponents } from "@/tools";
import { ToolShell } from "@/components/tool/ToolShell";
import { Clock } from "lucide-react";

interface ToolPageRouteProps {
  params: Promise<{
    category: string;
    tool: string;
  }>;
}

export async function generateStaticParams() {
  return liveTools().map((t) => ({
    category: t.category,
    tool: t.id,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageRouteProps): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) return {};

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageRouteProps) {
  const { category, tool: toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool || tool.category !== category || tool.status === "soon") {
    notFound();
  }

  const RegisteredComponent = toolComponents[tool.id];

  if (RegisteredComponent) {
    return <RegisteredComponent />;
  }

  // Fallback placeholder when tool component UI is not yet registered
  return (
    <ToolShell
      toolId={tool.id}
      input={
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 rounded-xl bg-[var(--sl-bg)] border border-[var(--sl-border)]">
          <Clock className="w-8 h-8 text-[var(--sl-accent)] animate-pulse" />
          <h3 className="text-base font-semibold text-[var(--sl-text)]">
            UI Finalize Ho Rahi Hai
          </h3>
          <p className="text-xs text-[var(--sl-muted)] max-w-sm">
            Is tool ka engine aur registry metadata ready hai. UI component Wave 1 me live ho raha hai.
          </p>
        </div>
      }
      output={null}
    />
  );
}
