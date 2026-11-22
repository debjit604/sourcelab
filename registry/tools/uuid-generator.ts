import { Tool } from "../types";

export const uuidGeneratorTool: Tool = {
  id: "uuid-generator",
  slug: "/util/uuid-generator",
  category: "util",
  name: "UUID / GUID Generator",
  tagline: "v4 UUIDs generate karo instantly — single ya bulk me",
  icon: "key-round",
  keywords: [
    "uuid generator",
    "guid generator",
    "random uuid",
    "uuid v4",
    "bulk uuid",
    "unique id",
    "uuid banao",
    "identifier",
    "rfc 4122",
  ],
  seo: {
    title: "UUID v4 Generator Online, Free & Fast | SourceLab",
    description:
      "Generate cryptographically secure RFC 4122 v4 UUIDs / GUIDs in bulk. Toggle hyphens, uppercase, and brackets. 100% private, client-side.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["hash-generator", "password-generator"],
  chainTo: ["hash-generator"],
  faq: [
    {
      q: "Kya ye UUIDs cryptographically secure hain?",
      a: "Haan, ye browser ke standard crypto.randomUUID() aur crypto.getRandomValues() API se generate hote hain jo CSPRNG standard follow karta hai.",
    },
    {
      q: "Kya UUID generator server se connect hota hai?",
      a: "Bilkul nahi! Sare UUIDs 100% tumhare browser ki local memory me bante hain. Koi network request nahi hoti.",
    },
    {
      q: "Ek baar me kitne UUIDs generate kar sakte hain?",
      a: "Tum 1 se lekar 500 UUIDs ek sath instantly generate kar sakte ho aur ek click me copy ya text file me download kar sakte ho.",
    },
    {
      q: "UUID v4 me hyphens ya uppercase format change kar sakte hain?",
      a: "Haan, tum standard format, bina hyphens wala raw hex format, uppercase format ya brackets format choose kar sakte ho.",
    },
  ],
  popular: 80,
  status: "live",
  addedOn: "2026-11-22",
};

export default uuidGeneratorTool;
