import { Tool } from "../types";

export const hashIdentifierTool: Tool = {
  id: "hash-identifier",
  slug: "/security/hash-identifier",
  category: "security",
  name: "Hash Type Identifier",
  tagline: "Unknown hash ka algorithm, type aur Hashcat mode pehchano",
  icon: "hash",
  keywords: [
    "hash identifier",
    "identify hash",
    "hash type detector",
    "hashcat mode",
    "john the ripper format",
    "md5 sha256 detector",
    "unknown hash",
  ],
  seo: {
    title: "Hash Identifier Online - Detect Hash Types & Modes | SourceLab",
    description:
      "Identify unknown cryptographic hash types, Hashcat modes, and John the Ripper formats. 100% private in your browser.",
  },
  inputs: ["text"],
  outputs: ["stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["hash-generator", "password-strength"],
  chainTo: ["hash-generator"],
  faq: [
    {
      q: "Hash identifier kaise kaam karta hai?",
      a: "Ye hash string ki length, character set (hexadecimal, base64), salt prefixes (jaise $2a$, $6$) aur standard signatures analyze karke matching algorithms list karta hai.",
    },
    {
      q: "Hashcat aur John the Ripper format kya hote hain?",
      a: "Security audits aur CTF competitions me hash crack karne ke liye tools ko format code (jaise Hashcat -m 0 for MD5, -m 1000 for NTLM) dena hota hai, jo ye tool directly provide karta hai.",
    },
    {
      q: "Kya ek hi length ke alag alag hash ho sakte hain?",
      a: "Haan! Jaise 32 hex characters MD5 bhi ho sakta hai aur NTLM bhi. Isliye tool sabhi possible matches ko confidence rating ke sath dikhata hai.",
    },
    {
      q: "Kya mera hash kisi server par verify hota hai?",
      a: "Nahi, saari pattern recognition aur analysis purely local JavaScript regex rules se hoti hai. 100% offline.",
    },
  ],
  popular: 91,
  status: "live",
  addedOn: "2026-11-23",
};

export default hashIdentifierTool;
