export interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgbString: string;
  hsl: { h: number; s: number; l: number };
  hslString: string;
  cmyk: { c: number; m: number; y: number; k: number };
  cmykString: string;
  contrastWhite: number;
  contrastBlack: number;
  shades: { level: number; hex: string }[];
}

export function cleanHex(input: string): string {
  let h = input.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  return h.toLowerCase();
}

export function isValidHex(hex: string): boolean {
  return /^[0-9a-f]{6}$/i.test(cleanHex(hex));
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = cleanHex(hex);
  if (!isValidHex(clean)) return null;
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / delta + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function generateShades(r: number, g: number, b: number): { level: number; hex: string }[] {
  const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return levels.map((lvl) => {
    let factor: number;
    if (lvl < 500) {
      factor = (500 - lvl) / 500;
      return {
        level: lvl,
        hex: rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor),
      };
    } else if (lvl > 500) {
      factor = (lvl - 500) / 500;
      return {
        level: lvl,
        hex: rgbToHex(r * (1 - factor), g * (1 - factor), b * (1 - factor)),
      };
    }
    return { level: 500, hex: rgbToHex(r, g, b) };
  });
}

export function parseColor(input: string): ColorFormats | null {
  const rgb = hexToRgb(input);
  if (!rgb) return null;

  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);

  const contrastWhite = getContrastRatio(lum, 1.0);
  const contrastBlack = getContrastRatio(lum, 0.0);
  const shades = generateShades(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    rgb,
    rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    cmyk,
    cmykString: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    contrastWhite,
    contrastBlack,
    shades,
  };
}
