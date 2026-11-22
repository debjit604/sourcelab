import { Tool } from "../types";

export const timestampConverterTool: Tool = {
  id: "timestamp-converter",
  slug: "/util/timestamp-converter",
  category: "util",
  name: "Timestamp Converter",
  tagline: "Unix epoch timestamp aur human date ke beech do-tarfa convert karo",
  icon: "wrench",
  keywords: [
    "timestamp",
    "timestamp converter",
    "epoch converter",
    "unix timestamp",
    "epoch to date",
    "date to epoch",
    "utc converter",
    "iso 8601",
    "samay converter",
  ],
  seo: {
    title: "Unix Timestamp & Epoch Converter Online, Free | SourceLab",
    description:
      "Convert Unix epoch timestamps to human readable dates (UTC & Local) and vice versa. Live ticking clock with zero server uploads.",
  },
  inputs: ["text", "date"],
  outputs: ["text", "stats"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["jwt-decoder", "uuid-generator"],
  chainTo: ["jwt-decoder"],
  faq: [
    {
      q: "Unix Epoch timestamp kya hota hai?",
      a: "Unix epoch 1 January 1970 00:00:00 UTC se lekar ab tak beete hue seconds ya milliseconds ki ginti hoti hai, jo servers aur databases me time store karne ke liye use hoti hai.",
    },
    {
      q: "Seconds aur Milliseconds timestamp me kya farak hai?",
      a: "Seconds timestamp aam taur par 10 digits ka hota hai (jaise 1700000000), jabki milliseconds timestamp 13 digits ka hota hai (jaise 1700000000000). Ye tool dono ko auto-detect kar leta hai.",
    },
    {
      q: "Kya mera date ya time data server pe upload hota hai?",
      a: "Bilkul nahi! Saari conversions aapke browser me JavaScript ke standard Date object se locally hoti hain. Zero upload, 100% private.",
    },
    {
      q: "Kya ye local timezone aur UTC dono dikhata hai?",
      a: "Haan, ye aapke system ka local time, standard UTC time, ISO 8601 string aur relative time ('2 hours ago') sab ek sath dikhata hai.",
    },
  ],
  popular: 90,
  status: "live",
  addedOn: "2026-11-23",
};

export default timestampConverterTool;
