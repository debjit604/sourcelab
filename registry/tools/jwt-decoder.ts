import { Tool } from "../types";

export const jwtDecoderTool: Tool = {
  id: "jwt-decoder",
  slug: "/dev/jwt-decoder",
  category: "dev",
  name: "JWT Decoder",
  tagline: "JWT decode karo, header, payload aur expiry dekho",
  icon: "key-round",
  keywords: [
    "jwt",
    "token",
    "decoder",
    "jwt io",
    "bearer",
    "json web token",
    "decode jwt",
    "tokan",
    "expiry check",
  ],
  seo: {
    title: "JWT Decoder Online - Decode JSON Web Tokens Privately | SourceLab",
    description: "Decode and inspect JWT header and payload in your browser. Check expiration time, algorithm, and claims with zero server upload.",
  },
  inputs: ["text"],
  outputs: ["text", "json"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["base64", "json-formatter", "url-encoder"],
  chainTo: ["json-formatter"],
  faq: [
    {
      q: "Kya mera JWT token kisi server par jata hai?",
      a: "Nahi, decoding 100% tumhare browser me local JS se hoti hai. Token kisi bhi server ya analytics ko nahi bheja jata.",
    },
    {
      q: "Kya ye tool JWT signature verify karta hai?",
      a: "Ye tool header aur payload ko decode karta hai. Standard JWT verification ke liye secret ya public key ki zaroorat hoti hai.",
    },
    {
      q: "Token kab expire hoga kaise pata chalega?",
      a: "Payload me 'exp' claim milne par tool automatically expiry date, time aur time remaining (ya expired status) display karta hai.",
    },
    {
      q: "Invalid token error ka kya matlab hai?",
      a: "Valid JWT me dot (.) se separate 3 parts hone chahiye: Header, Payload aur Signature. Agar format galat ho ya Base64URL corrupt ho to error aayega.",
    },
  ],
  popular: 88,
  status: "live",
  addedOn: "2026-11-22",
};

export default jwtDecoderTool;
