import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/trainee/dashboard",
    "/trainee/documents",
    "/trainee/profile",
    "/trainee/help",
    "/trainee/settings",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: (route === "" ? "weekly" : "daily") as "weekly" | "daily",
    priority: route === "" ? 1 : route.includes("dashboard") || route.includes("documents") ? 0.9 : 0.7,
  }))

  return [...routes]
}