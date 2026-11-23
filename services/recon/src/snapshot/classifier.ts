import path from "path";
import { AssetFolder } from "./types";

const EXTENSION_MAP: Record<string, AssetFolder> = {
  // HTML
  html: "html",
  htm: "html",
  xhtml: "html",

  // CSS
  css: "css",

  // JS & Source Maps
  js: "js",
  mjs: "js",
  cjs: "js",
  jsx: "js",
  ts: "js",
  tsx: "js",
  map: "js",

  // Images
  png: "images",
  jpg: "images",
  jpeg: "images",
  gif: "images",
  svg: "images",
  webp: "images",
  ico: "images",
  bmp: "images",
  avif: "images",
  tiff: "images",

  // Fonts
  woff: "fonts",
  woff2: "fonts",
  ttf: "fonts",
  otf: "fonts",
  eot: "fonts",

  // Docs
  pdf: "docs",
  doc: "docs",
  docx: "docs",
  txt: "docs",
  csv: "docs",
  xls: "docs",
  xlsx: "docs",
  md: "docs",
  xml: "docs",
  json: "docs",

  // Archives
  zip: "archives",
  tar: "archives",
  gz: "archives",
  tgz: "archives",
  "7z": "archives",
  rar: "archives",
};

export function sanitizeFilename(raw: string, fallback = "asset"): string {
  if (!raw || typeof raw !== "string") return fallback;
  // Strip query string and hash
  const clean = raw.split("?")[0].split("#")[0];
  const basename = path.basename(clean);
  // Remove dangerous chars
  const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!sanitized || sanitized === "." || sanitized === "..") {
    return fallback;
  }
  return sanitized.slice(0, 100);
}

export function categorizeAsset(
  rawUrl: string,
  contentType = ""
): { folder: AssetFolder; filename: string } {
  let pathname = "";
  try {
    pathname = new URL(rawUrl).pathname;
  } catch {
    pathname = rawUrl.split("?")[0];
  }

  const rawExt = path.extname(pathname).toLowerCase().replace(".", "");
  const filename = sanitizeFilename(pathname, "download");

  // Check by extension
  if (rawExt && EXTENSION_MAP[rawExt]) {
    return { folder: EXTENSION_MAP[rawExt], filename };
  }

  // Check by Content-Type header
  const ct = contentType.toLowerCase();
  if (ct.includes("text/html")) return { folder: "html", filename: `${filename}.html` };
  if (ct.includes("text/css")) return { folder: "css", filename: `${filename}.css` };
  if (ct.includes("javascript") || ct.includes("ecmascript")) return { folder: "js", filename: `${filename}.js` };
  if (ct.includes("image/")) return { folder: "images", filename };
  if (ct.includes("font/") || ct.includes("application/font-woff")) return { folder: "fonts", filename };
  if (ct.includes("application/pdf") || ct.includes("text/plain")) return { folder: "docs", filename };
  if (ct.includes("zip") || ct.includes("compressed") || ct.includes("tar")) return { folder: "archives", filename };

  return { folder: "other", filename };
}

export function extractSourceMapUrl(jsContent: string, scriptUrl: string): string | null {
  if (!jsContent) return null;
  // Construct regex dynamically to prevent Vite from treating it as an actual file source map
  const pattern = new RegExp("//[#@]\\s*" + ["sourceMapping", "URL="].join("") + "([^\\s'\"]+)");
  const match = jsContent.match(pattern);
  if (!match || !match[1]) return null;

  const rawMapUrl = match[1].trim();
  // If data URI, skip remote fetch
  if (rawMapUrl.startsWith("data:")) return null;

  try {
    return new URL(rawMapUrl, scriptUrl).toString();
  } catch {
    return null;
  }
}
