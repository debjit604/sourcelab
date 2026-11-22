import { Tool } from "../types";

export const morseCodeTool: Tool = {
  id: "morse-code",
  slug: "/security/morse-code",
  category: "security",
  name: "Morse Code Translator & Player",
  tagline: "Text ko Morse code me convert karo aur real audio beeps suno",
  icon: "radio",
  keywords: [
    "morse code",
    "morse translator",
    "text to morse",
    "morse to text",
    "morse audio player",
    "beeps",
    "cw audio",
    "sos code",
    "ctf morse",
  ],
  seo: {
    title: "Morse Code Translator & Audio Player Online | SourceLab",
    description:
      "Translate text to Morse code and Morse code to text with instant Web Audio beeps, WPM speed control, and ITU standard compliance.",
  },
  inputs: ["text"],
  outputs: ["text"],
  engine: "js",
  wave: 1,
  heavy: false,
  privacy: "client",
  related: ["caesar-rot", "magic-decoder", "xor-tool"],
  chainTo: ["magic-decoder"],
  faq: [
    {
      q: "Morse code audio kaise kaam karta hai?",
      a: "Web Audio API se oscillator tone generate hota hai, jisse bina kisi server request ke pure browser me real-time beeps play hoti hain.",
    },
    {
      q: "Word aur letter spacing kaise kaam karti hai?",
      a: "Letters ke beech single space aur words ke beech forward slash ( / ) use kiya jata hai taaki decoding accurate rahe.",
    },
    {
      q: "WPM (Words Per Minute) speed kaise adjust karein?",
      a: "Audio settings me speed slider se 5 WPM se 40 WPM tak speed change kar sakte ho, jo international standard timing follow karta hai.",
    },
    {
      q: "Kya ye tool offline chalta hai?",
      a: "Haan, calculation aur audio synthesis 100% client-side JavaScript me execute hoti hai. Zero tracking aur zero server dependency.",
    },
  ],
  popular: 88,
  status: "live",
  addedOn: "2026-11-23",
};

export default morseCodeTool;
