import { Tool } from "../types";

export const hashGeneratorTool: Tool = {
  id: "hash-generator",
  slug: "/security/hash-generator",
  category: "security",
  name: "Hash Generator",
  tagline: "MD5, SHA-1, SHA-256, SHA-384 aur SHA-512 hashes instantly banao",
  icon: "hash",
  keywords: [
    "hash",
    "md5",
    "sha256",
    "sha1",
    "sha512",
    "sha384",
    "checksum",
    "digest",
    "crypto",
    "generator",
    "hasher",
    "hesha",
  ],
  seo: {
    title: "Hash Generator Online - MD5, SHA-256, SHA-512 Free | SourceLab",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes for text and files in your browser. 100% private, zero upload.",
  },
  inputs: ["text", "file"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "jwt-decoder"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Kya meri file ya text hash calculate karne ke liye server par upload hoti hai?",
      a: "Nahi, bilkul nahi! SHA hashes Web Crypto API se aur MD5 spark-md5 se direct tumhare browser me compute hote hain. Server par zero data jata hai.",
    },
    {
      q: "Kya main file ka checksum nikaal sakta hoon?",
      a: "Haan, text ke alawa tum koi bhi file drop karke uska MD5 ya SHA-256 checksum verify kar sakte ho.",
    },
    {
      q: "MD5 aur SHA-256 me kya antar hai?",
      a: "MD5 purana algorithm hai jo quick integrity verification ke liye fast hai. SHA-256 modern aur cryptographically secure algorithm hai.",
    },
    {
      q: "Uppercase ya lowercase hash me farak padta hai?",
      a: "Nahi, hexadecimal representation me dono identical hote hain. Tool me tum easily uppercase ya lowercase switch kar sakte ho.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-22",
};

export default hashGeneratorTool;
