import { Tool } from "../types";

export const htmlEntityTool: Tool = {
  id: "html-entity",
  slug: "/dev/html-entity",
  category: "dev",
  name: "HTML Entity Encoder & Decoder",
  tagline: "Special characters aur HTML entities ke beech encode/decode karo",
  icon: "code",
  keywords: [
    "html entity",
    "html encode",
    "html decode",
    "special characters",
    "ampersand",
    "html escape",
    "unescape html",
  ],
  seo: {
    title: "HTML Entity Encoder & Decoder Online, Free | SourceLab",
    description:
      "Encode text to HTML entities (named, decimal, hex) or decode entities to plain text in real-time. 100% private in browser.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 3,
  heavy: false,
  privacy: "client",
  related: ["url-encoder", "base64"],
  chainTo: ["url-encoder"],
  faq: [
    {
      q: "HTML Entity encode kyun zaroori hai?",
      a: "Special characters jaise <, >, & ko HTML me direct likhne se parsing errors ya XSS security risks ho sakte hain, isliye inhe &lt;, &gt;, &amp; me encode karna zaroori hota hai.",
    },
    {
      q: "Kaunse entity formats supported hain?",
      a: "Named entities (&copy;), Decimal entities (&#169;), aur Hexadecimal entities (&#xA9;) sabhi formats encode aur decode hote hain.",
    },
    {
      q: "Kya emojis aur non-ASCII characters bhi encode hote hain?",
      a: "Haan, emojis aur foreign script characters decimal ya hex entities me convert ho sakte hain.",
    },
    {
      q: "Kya koi data server pe jata hai?",
      a: "Nahi, saari string processing pure browser JavaScript me hoti hai.",
    },
  ],
  popular: 88,
  status: "live",
  addedOn: "2026-11-23",
};

export default htmlEntityTool;
