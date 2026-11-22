import { Tool } from "../types";

export const totpGeneratorTool: Tool = {
  id: "totp-generator",
  slug: "/security/totp-generator",
  category: "security",
  name: "2FA TOTP Token Generator",
  tagline: "RFC 6238 2FA codes generate aur test karo bina internet/server ke",
  icon: "key-round",
  keywords: [
    "totp",
    "2fa generator",
    "google authenticator",
    "otp generator",
    "rfc 6238",
    "two factor auth",
    "totp secret",
    "authenticator code",
  ],
  seo: {
    title: "2FA TOTP Token Generator Online - RFC 6238 | SourceLab",
    description:
      "Generate 2FA TOTP authentication codes locally from Base32 secret keys. 100% private in browser with zero server uploads.",
  },
  inputs: ["text"],
  outputs: ["stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["password-generator", "password-strength"],
  chainTo: ["password-generator"],
  faq: [
    {
      q: "TOTP kya hota hai?",
      a: "TOTP (Time-Based One-Time Password) RFC 6238 standard hai jo Google Authenticator, Authy aur GitHub 2FA me 30-second rotating security codes generate karne ke liye use hota hai.",
    },
    {
      q: "Kya mera 2FA Secret Key server pe upload hota hai?",
      a: "Bilkul nahi! Secret key aur HMAC-SHA1 calculations aapke browser me Web Crypto API se 100% locally execute hoti hain. Secret key kabhi kisi network request me nahi jaati.",
    },
    {
      q: "Kaunse parameters customize kiye ja sakte hain?",
      a: "Aap standard 6 ya 8 digits token length, 30s ya 60s period duration, aur SHA-1, SHA-256 ya SHA-512 algorithms choose kar sakte hain.",
    },
    {
      q: "Agar Base32 secret key me spaces ya hyphens hon toh?",
      a: "Tool automatically spaces, hyphens aur lowercase letters ko clean karke standard RFC 3548 Base32 format me parse karta hai.",
    },
  ],
  popular: 92,
  status: "live",
  addedOn: "2026-11-23",
};

export default totpGeneratorTool;
