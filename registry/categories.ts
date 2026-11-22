import { Category, CategoryMeta } from "./types";

export const CATEGORIES: Record<Category, CategoryMeta> = {
  pdf: {
    id: "pdf",
    name: "PDF Tools",
    tagline: "PDF merge, compress aur convert karo bina upload kiye",
    color: "#EF4444",
    icon: "file-text",
  },
  image: {
    id: "image",
    name: "Image Tools",
    tagline: "Photo resize, compress aur format badlo instantly",
    color: "#3B82F6",
    icon: "image",
  },
  video: {
    id: "video",
    name: "Video Tools",
    tagline: "Video trim, compress aur convert karo browser me",
    color: "#8B5CF6",
    icon: "video",
  },
  audio: {
    id: "audio",
    name: "Audio Tools",
    tagline: "Audio cut, convert aur compress karo",
    color: "#EC4899",
    icon: "headphones",
  },
  ai: {
    id: "ai",
    name: "AI Tools",
    tagline: "Browser me hi local AI models chalao private tarike se",
    color: "#A855F7",
    icon: "sparkles",
  },
  dev: {
    id: "dev",
    name: "Developer Tools",
    tagline: "Code format, decode aur debug karo bina server ke",
    color: "#22D3EE",
    icon: "code",
  },
  security: {
    id: "security",
    name: "Security Tools",
    tagline: "Hash generate karo, password check karo bina leak ke",
    color: "#10B981",
    icon: "shield-check",
  },
  text: {
    id: "text",
    name: "Text Tools",
    tagline: "Word count, diff aur text formatting tools",
    color: "#F59E0B",
    icon: "type",
  },
  calc: {
    id: "calc",
    name: "Calculators",
    tagline: "EMI, GST aur financial hisaab-kitaab turant",
    color: "#14B8A6",
    icon: "calculator",
  },
  india: {
    id: "india",
    name: "India Utilities",
    tagline: "Aadhaar mask, IFSC lookup aur daily Bharat utilities",
    color: "#F97316",
    icon: "landmark",
  },
  util: {
    id: "util",
    name: "General Utilities",
    tagline: "Rozmarra ke daily quick tools tumhari ungliyo par",
    color: "#6366F1",
    icon: "wrench",
  },
  ocr: {
    id: "ocr",
    name: "OCR Tools",
    tagline: "Image aur scan document se text nikalo bina server bheje",
    color: "#06B6D4",
    icon: "scan-text",
  },
  gen: {
    id: "gen",
    name: "Generators",
    tagline: "QR code, barcode aur placeholder instantly banao",
    color: "#E11D48",
    icon: "qr-code",
  },
};

export const categoryList: CategoryMeta[] = Object.values(CATEGORIES);

export function getCategoryMeta(category: Category): CategoryMeta {
  return CATEGORIES[category] || {
    id: category,
    name: category.toUpperCase(),
    tagline: "Browser utilities",
    color: "#22D3EE",
    icon: "wrench",
  };
}
