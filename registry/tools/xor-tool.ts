import { Tool } from "../types";

export const xorToolTool: Tool = {
  id: "xor-tool",
  slug: "/security/xor-tool",
  category: "security",
  name: "XOR Cipher & Decoder",
  tagline: "Bitwise XOR encryption, repeating-key cipher aur brute-force",
  icon: "binary",
  keywords: [
    "xor tool",
    "xor cipher",
    "repeating key xor",
    "single byte xor",
    "xor brute force",
    "cryptopals",
    "bitwise xor",
    "ctf cipher",
  ],
  seo: {
    title: "XOR Cipher & Brute-Force Decoder Online | SourceLab",
    description:
      "Encrypt, decrypt, and brute-force single-byte or repeating-key XOR ciphers in Hex or text. 100% private in browser with zero server uploads.",
  },
  inputs: ["text"],
  outputs: ["text", "table"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["magic-decoder", "caesar-rot"],
  chainTo: ["magic-decoder"],
  faq: [
    {
      q: "XOR cipher kaise kaam karta hai?",
      a: "Ye plaintext ke har byte aur secret key ke byte ke beech bitwise exclusive-OR (XOR) operation perform karta hai. Kyunki A ^ B ^ B = A, wahi same key encryption aur decryption dono ke liye kaam aati hai.",
    },
    {
      q: "Repeating-key XOR kya hota hai?",
      a: "Jab key plaintext se chhoti hoti hai, toh key ko baar-baar repeat karke pura text encode kiya jata hai (jaise Cryptopals challenges me).",
    },
    {
      q: "Single-byte XOR brute force kya karta hai?",
      a: "Agar aapko key nahi pata, toh ye tool 0x00 se 0xFF (256 keys) tak sabhi test karta hai aur English frequency scoring se readable flag sabse upar dikhata hai.",
    },
    {
      q: "Kya mera cipher text server pe upload hota hai?",
      a: "Nahi! Saari bitwise calculations aapke browser me locally hoti hain. 100% private aur offline.",
    },
  ],
  popular: 89,
  status: "live",
  addedOn: "2026-11-23",
};

export default xorToolTool;
