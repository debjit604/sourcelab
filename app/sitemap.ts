import { MetadataRoute } from "next";
import { categoryList, liveTools } from "@/registry";

export const dynamic = "force-static";

const BASE_URL = "https://sourcelab.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/request-tool`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category URLs
  for (const cat of categoryList) {
    routes.push({
      url: `${BASE_URL}/${cat.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Live Tool URLs
  for (const tool of liveTools()) {
    routes.push({
      url: `${BASE_URL}${tool.slug}`,
      lastModified: new Date(tool.addedOn),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return routes;
}
