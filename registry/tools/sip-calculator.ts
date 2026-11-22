import { Tool } from "../types";

export const sipCalculatorTool: Tool = {
  id: "sip-calculator",
  slug: "/calc/sip-calculator",
  category: "calc",
  name: "SIP Calculator",
  tagline: "Mutual fund SIP aur lumpsum returns calculate karo turant",
  icon: "landmark",
  keywords: [
    "sip",
    "sip calculator",
    "mutual fund",
    "sip returns",
    "lumpsum calculator",
    "investment calculator",
    "wealth planner",
    "mutual fund returns",
    "step up sip",
  ],
  seo: {
    title: "SIP Calculator Online - Mutual Fund SIP Returns | SourceLab",
    description:
      "Calculate mutual fund SIP and lumpsum returns, wealth growth, and year-by-year maturity value. 100% private in browser with zero server uploads.",
  },
  inputs: ["none"],
  outputs: ["stats", "table"],
  engine: "js",
  wave: 2,
  heavy: false,
  privacy: "client",
  related: ["emi-calculator", "gst-calculator"],
  chainTo: ["emi-calculator"],
  faq: [
    {
      q: "SIP calculator kaise kaam karta hai?",
      a: "Ye compound interest formula use karke aapke monthly investment, expected rate of return aur investment duration ke hisaab se total maturity value aur returns calculate karta hai.",
    },
    {
      q: "Kya mera financial data server pe jata hai?",
      a: "Nahi, sabhi calculations 100% aapke browser me locally hoti hain. Koi bhi financial data kabhi kisi server pe upload nahi hota.",
    },
    {
      q: "Step-up SIP ka kya matlab hai?",
      a: "Step-up SIP me aap har saal apna monthly investment ek fix percentage (jaise 10%) badhaate hain, jisse long-term me compounding ka fayda aur bada milta hai.",
    },
    {
      q: "SIP aur Lumpsum me kya farak hai?",
      a: "SIP me aap har mahine ek fixed amount invest karte hain, jabki Lumpsum me aap ek hi baar me pura paisa invest kar dete hain.",
    },
  ],
  popular: 94,
  status: "live",
  addedOn: "2026-11-23",
};

export default sipCalculatorTool;
