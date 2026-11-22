import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SourceLab — Privacy-First Browser Tools",
    short_name: "SourceLab",
    description:
      "Free, no-signup, privacy-first suite of browser tools. Tumhari file tumhare browser me hi process hoti hai.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F1A",
    theme_color: "#22D3EE",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
