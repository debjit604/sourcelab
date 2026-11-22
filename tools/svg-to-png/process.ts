export interface SvgDimensions {
  width: number;
  height: number;
}

export function isValidSvg(svgText: string): boolean {
  if (!svgText || typeof svgText !== "string") return false;
  const trimmed = svgText.trim().toLowerCase();
  return trimmed.includes("<svg") && trimmed.includes("</svg>");
}

export function parseSvgDimensions(svgText: string): SvgDimensions {
  if (!isValidSvg(svgText)) {
    return { width: 300, height: 150 };
  }

  // 1. Try width & height attributes
  const widthMatch = svgText.match(/<svg[^>]*\bwidth=["'](\d+(?:\.\d+)?)(?:px)?["']/i);
  const heightMatch = svgText.match(/<svg[^>]*\bheight=["'](\d+(?:\.\d+)?)(?:px)?["']/i);

  if (widthMatch && heightMatch) {
    const w = parseFloat(widthMatch[1]);
    const h = parseFloat(heightMatch[1]);
    if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
  }

  // 2. Try viewBox="minX minY width height"
  const viewBoxMatch = svgText.match(/<svg[^>]*\bviewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (viewBoxMatch) {
    const w = parseFloat(viewBoxMatch[3]);
    const h = parseFloat(viewBoxMatch[4]);
    if (w > 0 && h > 0) return { width: Math.round(w), height: Math.round(h) };
  }

  return { width: 512, height: 512 };
}

export function calculateScaledDimensions(
  origWidth: number,
  origHeight: number,
  scale: number
): SvgDimensions {
  const s = Math.max(0.25, Math.min(8, scale));
  return {
    width: Math.round(origWidth * s),
    height: Math.round(origHeight * s),
  };
}
