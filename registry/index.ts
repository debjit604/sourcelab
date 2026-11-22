import Fuse from "fuse.js";
import { allTools } from "./generated";
import { Category, Tool } from "./types";

export * from "./types";
export * from "./categories";
export { allTools } from "./generated";

export function getToolById(id: string): Tool | undefined {
  return allTools.find((t) => t.id === id);
}

export function getToolBySlug(slug: string): Tool | undefined {
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  return allTools.find((t) => t.slug === normalized);
}

export function liveTools(): Tool[] {
  return allTools.filter((t) => t.status === "live");
}

export function toolsByCategory(category: Category): Tool[] {
  return allTools.filter((t) => t.category === category);
}

export function popularTools(limit = 8): Tool[] {
  return [...allTools]
    .sort((a, b) => b.popular - a.popular)
    .slice(0, limit);
}

export function newTools(limit = 8): Tool[] {
  return [...allTools]
    .sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
    .slice(0, limit);
}

const fuseInstance = new Fuse(allTools, {
  keys: [
    { name: "name", weight: 0.35 },
    { name: "keywords", weight: 0.35 },
    { name: "tagline", weight: 0.2 },
    { name: "id", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
});

export function searchTools(query: string): Tool[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return popularTools(10);
  }
  const results = fuseInstance.search(trimmed);
  return results.map((r) => r.item);
}
