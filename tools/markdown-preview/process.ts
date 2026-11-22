export interface MarkdownStats {
  words: number;
  chars: number;
  lines: number;
  headings: number;
}

export function getMarkdownStats(md: string): MarkdownStats {
  if (!md) {
    return { words: 0, chars: 0, lines: 0, headings: 0 };
  }
  const lines = md.split("\n");
  const words = (md.match(/\b\w+\b/g) || []).length;
  const headings = (md.match(/^#{1,6}\s+/gm) || []).length;
  return {
    words,
    chars: md.length,
    lines: lines.length,
    headings,
  };
}

/**
 * Lightweight, safe GFM-compliant markdown to HTML parser
 */
export function markdownToHtml(md: string): string {
  if (!md) return "";

  // 1. Escape basic HTML entities to prevent injection
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Fenced code blocks ```lang\ncode\n```
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-[#0B0F1A] p-3 rounded-lg border border-[#232C42] overflow-x-auto my-3"><code class="text-[#22D3EE] font-mono text-xs">${code.trim()}</code></pre>`;
  });

  // 3. Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#0B0F1A] px-1.5 py-0.5 rounded text-[#22D3EE] font-mono text-xs border border-[#232C42]">$1</code>');

  // 4. Headings (# h1 to ###### h6)
  html = html.replace(/^######\s+(.*?)$/gm, '<h6 class="text-xs font-bold text-[#E6EAF2] mt-3 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.*?)$/gm, '<h5 class="text-sm font-bold text-[#E6EAF2] mt-3 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.*?)$/gm, '<h4 class="text-base font-bold text-[#E6EAF2] mt-4 mb-1.5">$1</h4>');
  html = html.replace(/^###\s+(.*?)$/gm, '<h3 class="text-lg font-bold text-[#E6EAF2] mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.*?)$/gm, '<h2 class="text-xl font-bold text-[#E6EAF2] mt-5 mb-2 border-b border-[#232C42] pb-1">$1</h2>');
  html = html.replace(/^#\s+(.*?)$/gm, '<h1 class="text-2xl font-bold text-[#22D3EE] mt-6 mb-3 border-b border-[#232C42] pb-2">$1</h1>');

  // 5. Horizontal rule
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr class="my-4 border-[#232C42]" />');

  // 6. Blockquotes
  html = html.replace(/^>\s+(.*?)$/gm, '<blockquote class="border-l-4 border-[#22D3EE] pl-3 py-1 my-2 text-[#8B95AD] italic bg-[#121828]/50 rounded-r">$1</blockquote>');

  // 7. Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E6EAF2] font-semibold">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/~~(.*?)~~/g, "<del class='line-through text-[#8B95AD]'>$1</del>");

  // 8. Task lists & Unordered list items
  html = html.replace(/^-\s+\[ \]\s+(.*?)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="accent-[#22D3EE]" /><span>$1</span></div>');
  html = html.replace(/^-\s+\[x\]\s+(.*?)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="accent-[#22D3EE]" /><span class="line-through text-[#8B95AD]">$1</span></div>');
  html = html.replace(/^[-*+]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-[#E6EAF2] my-0.5">$1</li>');

  // 9. Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#22D3EE] underline hover:text-cyan-300">$1</a>');

  // 10. Paragraphs (lines separated by double newlines)
  const paragraphs = html.split(/\n{2,}/);
  const formatted = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<div")
      ) {
        return trimmed;
      }
      return `<p class="my-2 leading-relaxed text-[#E6EAF2]">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return formatted;
}
