import { Tool } from "../types";

export const caesarRotTool: Tool = {
  id: "caesar-rot",
  slug: "/security/caesar-rot",
  category: "security",
  name: "Caesar Cipher & ROT Decoder",
  tagline: "Caesar cipher encode/decode karo aur saare 25 ROT shifts ek sath dekho",
  icon: "key-round",
  keywords: [
    "caesar cipher",
    "rot13",
    "rot decoder",
    "caesar shift",
    "rot1 to rot25",
    "ctf cipher",
    "substitution cipher",
  ],
  seo: {
    title: "Caesar Cipher & ROT Decoder Online - All 25 Shifts | SourceLab",
    description:
      "Encode, decode, and brute-force all 25 Caesar cipher and ROT shifts in real-time. 100% private in browser with zero server uploads.",
  },
  inputs: ["text"],
  outputs: ["text", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["magic-decoder", "hash-identifier"],
  chainTo: ["magic-decoder"],
  faq: [
    {
      q: "Caesar Cipher kaise kaam karta hai?",
      a: "Ye ek classical substitution cipher hai jisme har letter ko alphabet me ek specific number of positions (shift key) aage ya peeche khiskaya jata hai.",
    },
    {
      q: "ROT13 kya hai?",
      a: "ROT13 ek special Caesar cipher hai jisme shift value 13 hoti hai. 26 letters ke alphabet me do baar ROT13 karne par wapas original text mil jata hai.",
    },
    {
      q: "Brute Force All 25 Shifts ka kya fayda hai?",
      a: "Agar aapko pata nahi hai ki kaunsi shift key use hui hai, toh ye tool 1 se 25 tak ke sabhi possible shifts ek sath table me dikha deta hai taaki aap readable message turant pehchan sakein.",
    },
    {
      q: "Kya mera secret text internet pe jata hai?",
      a: "Nahi, saara Caesar encryption aur decryption purely local JavaScript calculation se aapke browser me hota hai.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-23",
};

export default caesarRotTool;
