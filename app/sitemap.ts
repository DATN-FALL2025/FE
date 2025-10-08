import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/students/dashboard",
    "/students/documents",
    "/students/profile",
    "/students/help",
    "/students/settings",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: (route === "" ? "weekly" : "daily") as "weekly" | "daily",
    priority: route === "" ? 1 : route.includes("dashboard") || route.includes("documents") ? 0.9 : 0.7,
  }))

  return [...routes]
}