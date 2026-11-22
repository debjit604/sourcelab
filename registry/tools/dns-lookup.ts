import { Tool } from "../types";

export const dnsLookupTool: Tool = {
  id: "dns-lookup",
  slug: "/security/dns-lookup",
  category: "security",
  name: "DNS over HTTPS (DoH) Lookup",
  tagline: "Domain ke A, MX, TXT, SPF aur DMARC records live check karo",
  icon: "globe",
  keywords: [
    "dns lookup",
    "doh",
    "dns over https",
    "mx record checker",
    "spf record check",
    "dmarc check",
    "txt records",
    "cname lookup",
  ],
  seo: {
    title: "DNS over HTTPS (DoH) Lookup Online | SourceLab",
    description:
      "Query DNS records (A, AAAA, MX, TXT, NS, CNAME, CAA, SOA) directly via Cloudflare or Google DoH with SPF and DMARC security checks.",
  },
  inputs: ["text"],
  outputs: ["table", "stats"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "third-party",
  thirdPartyNotice: "Queries go to Cloudflare / Google DoH",
  related: ["header-analyzer", "csp-evaluator", "js-analyzer"],
  chainTo: ["header-analyzer"],
  faq: [
    {
      q: "DNS over HTTPS (DoH) kaise kaam karta hai?",
      a: "Aapka browser directly public encrypted DoH endpoints (Cloudflare 1.1.1.1 ya Google 8.8.8.8) par HTTPS query bhejta hai, bina kisi intermediate ISP tracking ke.",
    },
    {
      q: "Kya ye tool Zero Upload hai?",
      a: "Nahi, kyunki domain ke live DNS records fetch karne ke liye query encrypted DoH resolver (Cloudflare ya Google) ke pass jati hai. Hum isse honestly 'Third-Party' label karte hain.",
    },
    {
      q: "Kaun se DNS record types check hote hain?",
      a: "A, AAAA (IPv6), MX (Mail exchange), TXT (SPF, DKIM, site verification), NS (Nameservers), CNAME, CAA aur SOA records support hain.",
    },
    {
      q: "SPF aur DMARC security check kya hai?",
      a: "TXT records me se email spoofing protection ke liye SPF (v=spf1) aur DMARC (v=DMARC1) policies ko automatically parse karke unki security state batata hai.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-23",
};

export default dnsLookupTool;
