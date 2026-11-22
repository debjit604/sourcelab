import { Tool } from "../types";

export const csvJsonTool: Tool = {
  id: "csv-json",
  slug: "/dev/csv-json",
  category: "dev",
  name: "CSV to JSON & JSON to CSV",
  tagline: "CSV spreadsheets aur JSON arrays ko aapas me convert karo",
  icon: "binary",
  keywords: [
    "csv to json",
    "json to csv",
    "convert csv",
    "csv parser",
    "json spreadsheet",
    "excel to json",
    "tsv to json",
    "csv converter",
  ],
  seo: {
    title: "CSV to JSON & JSON to CSV Converter Free | SourceLab",
    description:
      "Convert CSV text/files to JSON array and JSON to CSV instantly. Customize delimiters, header rows, and quotes. 100% private, client-side, zero upload.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["json-formatter", "diff-checker"],
  chainTo: ["json-formatter"],
  faq: [
    {
      q: "Kya meri sensitive CSV spreadsheet server par upload hoti hai?",
      a: "Nahi! Pura conversion PapaParse engine se tumhare browser ke andar memory me perform hota hai. Koi data bahar nahi jata.",
    },
    {
      q: "Kya custom delimiters (tab, semicolon, pipe) supported hain?",
      a: "Haan, tum Comma (,), Semicolon (;), Tab (\\t), ya Pipe (|) delimiter choose kar sakte ho ya auto-detect mode use kar sakte ho.",
    },
    {
      q: "Kitni badi CSV file convert kar sakte hain?",
      a: "Ye browser memory ke hisaab se 20MB+ CSV files aur hazaron rows ko instant parse kar leta hai.",
    },
    {
      q: "Bi-directional conversion supported hai?",
      a: "Haan! Ek click me CSV se JSON aur JSON array se CSV dono directions me convert kar sakte ho.",
    },
  ],
  popular: 87,
  status: "live",
  addedOn: "2026-11-23",
};

export default csvJsonTool;
