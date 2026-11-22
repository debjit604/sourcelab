import { describe, it, expect } from "vitest";
import { markdownToHtml, getMarkdownStats } from "./process";

describe("markdown-preview process", () => {
  it("converts headings properly", () => {
    const md = "# Title\n## Subtitle\n### Section";
    const html = markdownToHtml(md);
    expect(html).toContain("<h1");
    expect(html).toContain("Title</h1>");
    expect(html).toContain("<h2");
    expect(html).toContain("Subtitle</h2>");
    expect(html).toContain("<h3");
    expect(html).toContain("Section</h3>");
  });

  it("converts bold, italic and strikethrough", () => {
    const md = "This is **bold**, *italic*, and ~~deleted~~.";
    const html = markdownToHtml(md);
    expect(html).toContain('<strong class="text-[#E6EAF2] font-semibold">bold</strong>');
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<del class='line-through text-[#8B95AD]'>deleted</del>");
  });

  it("handles code blocks and inline code safely without script execution", () => {
    const md = "Here is `const x = 10;` and:\n```javascript\nconsole.log('<script>');\n```";
    const html = markdownToHtml(md);
    expect(html).toContain("<code");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("handles task lists and links", () => {
    const md = "- [x] Done task\n- [ ] Pending task\n[SourceLab](https://sourcelab.dev)";
    const html = markdownToHtml(md);
    expect(html).toContain('type="checkbox" checked');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('<a href="https://sourcelab.dev"');
    expect(html).toContain("SourceLab</a>");
  });

  it("calculates accurate markdown statistics", () => {
    const md = "# Hello World\nThis is a test paragraph with multiple words.\n\n## Another Heading";
    const stats = getMarkdownStats(md);
    expect(stats.words).toBe(12);
    expect(stats.headings).toBe(2);
    expect(stats.lines).toBe(4);
    expect(stats.chars).toBe(md.length);
  });
});
