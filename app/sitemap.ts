import { MetadataRoute } from "next";
import { siteConfig } from "../config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const mainRoutes = siteConfig.routes
    .filter((route) => route.href !== "/")
    .map((route) => ({
      url: `${siteConfig.host}${route.href}`,
      lastModified: route.publishedAt,
    }));

  const legalRoutes = siteConfig.legalRoutes.map((route) => ({
    url: `${siteConfig.host}${route.href}`,
    lastModified: route.publishedAt,
  }));

  return [
    {
      url: siteConfig.host,
      lastModified: siteConfig.routes.find((route) => route.href === "/")
        ?.publishedAt,
    },
    ...mainRoutes,
    ...legalRoutes,
  ];
}
