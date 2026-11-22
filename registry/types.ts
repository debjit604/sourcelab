export type Category =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "ai"
  | "dev"
  | "security"
  | "text"
  | "calc"
  | "india"
  | "util"
  | "ocr"
  | "gen";

export type CategoryMeta = {
  id: Category;
  name: string;
  tagline: string; // Hinglish
  color: string;   // hex or tailwind token
  icon: string;    // lucide icon name
};

export type Tool = {
  id: string;                    // kebab-case
  slug: string;                  // "/dev/json-formatter"
  category: Category;
  name: string;
  tagline: string;               // Hinglish
  icon: string;                  // lucide name
  keywords: string[];            // include Hinglish typos
  seo: { title: string; description: string };  // English, 65/160 max
  inputs: string[];
  outputs: string[];
  engine: "js" | "canvas" | "pdf-lib" | "wasm" | "ai";
  wave: 1 | 2 | 3 | 4;
  heavy: boolean;
  modelSizeMB?: number;
  privacy: "client" | "server";
  related?: string[];
  chainTo?: string[];
  faq: { q: string; a: string }[];  // min 4, Hinglish
  popular: number;                  // 0-100
  status: "live" | "beta" | "soon";
  addedOn: string;                  // YYYY-MM-DD
};
