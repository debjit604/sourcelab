import { Tool } from "../types";

export const qrCodeTool: Tool = {
  id: "qr-code",
  slug: "/gen/qr-code",
  category: "gen",
  name: "QR Code Generator",
  tagline: "Custom colors, sizes aur formats me QR code instantly banao",
  icon: "qr-code",
  keywords: [
    "qr code",
    "qr",
    "generator",
    "qr maker",
    "create qr",
    "barcode",
    "link qr",
    "upi qr",
    "banao qr",
  ],
  seo: {
    title: "QR Code Generator Online - Free Custom SVG & PNG | SourceLab",
    description:
      "Generate custom QR codes for URLs, WiFi, UPI, and text in your browser. Download high-res PNG or SVG with zero tracking and zero server upload.",
  },
  inputs: ["text"],
  outputs: ["image", "svg"],
  engine: "canvas",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["url-encoder", "base64"],
  chainTo: ["base64"],
  faq: [
    {
      q: "Kya generated QR codes kabhi expire hote hain?",
      a: "Nahi, ye static QR codes hain. Data direct QR me encode hota hai isliye ye bina kisi expiry ke hamesha kaam karte hain.",
    },
    {
      q: "PNG aur SVG download me kya antar hai?",
      a: "PNG digital display ke liye perfect hai jabki SVG vector format hai jise kitna bhi zoom ya print karo, quality crisp rehti hai.",
    },
    {
      q: "Kya UPI ya WiFi QR code bana sakte hain?",
      a: "Haan! Standard UPI format (upi://pay?...) ya WiFi network format daal kar direct payment aur connection QR codes banaye ja sakte hain.",
    },
    {
      q: "Kya QR code create karne par koi upload hota hai?",
      a: "Bilkul nahi! Pure rendering local client-side canvas aur SVG generation se hoti hai bina kisi network request ke.",
    },
  ],
  popular: 96,
  status: "live",
  addedOn: "2026-11-22",
};

export default qrCodeTool;
