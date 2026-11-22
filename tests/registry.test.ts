import { describe, it, expect } from "vitest";
import {
  allTools,
  getToolById,
  getToolBySlug,
  liveTools,
  toolsByCategory,
  popularTools,
  newTools,
  searchTools,
  categoryList,
} from "../registry";

describe("Registry Verification", () => {
  it("loads registered tools", () => {
    expect(allTools.length).toBeGreaterThanOrEqual(2);
  });

  it("has exactly 13 defined categories", () => {
    expect(categoryList.length).toBe(13);
  });

  it("finds tool by ID", () => {
    const jsonTool = getToolById("json-formatter");
    expect(jsonTool).toBeDefined();
    expect(jsonTool?.name).toBe("JSON Formatter");
    expect(jsonTool?.category).toBe("dev");
  });

  it("finds tool by Slug", () => {
    const b64 = getToolBySlug("/dev/base64");
    expect(b64).toBeDefined();
    expect(b64?.id).toBe("base64");
  });

  it("filters live tools and category tools", () => {
    expect(liveTools().length).toBeGreaterThanOrEqual(2);
    expect(toolsByCategory("dev").length).toBeGreaterThanOrEqual(2);
    expect(toolsByCategory("pdf").length).toBe(0);
  });

  it("searches tools with fuse.js", () => {
    const res = searchTools("format");
    expect(res.some((t) => t.id === "json-formatter")).toBe(true);

    const resB64 = searchTools("base64");
    expect(resB64.some((t) => t.id === "base64")).toBe(true);
  });

  it("returns popular and new tools", () => {
    expect(popularTools(5).length).toBeGreaterThanOrEqual(2);
    expect(newTools(5).length).toBeGreaterThanOrEqual(2);
  });
});
