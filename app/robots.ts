import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/account/",
      },
    ],
    sitemap: `${siteConfig.host}/sitemap.xml`,
  };
}
