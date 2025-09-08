import { IconLinkType } from "@/types";

export const siteConfig: SiteConfig = {
  // Host where the site is deployed
  host: "https://depcheck.filipf.com",
  // Will be used in navbar, hero section and footer
  name: "DepCheck",
  // Will be used in hero section
  description: "",
  // Main routes
  // PublishedAt is used in sitemap so it can be updated automatically when the site
  // is built. Do not forget to update the publishedAt date when you update the content
  routes: [
    {
      label: "Home",
      href: "/",
      publishedAt: "2024-12-22",
    },
  ],
  // Legal routes. Can be found in the footer
  legalRoutes: [],
  // Social media links. Feel free to remove or add your own. Check IconLinkType for available icons
  socialLinks: {
    x: "https://twitter.com/filiphfr",
    github: "https://github.com/xylish7/dep-check",
  },
  // Links to download or use the app that is being promoted. Can be found in the hero section
  appLinks: {
    appStore: "#",
    googlePlay: "#",
    web: "#",
  },
  // Company information. Can be found in terms and conditions and privacy policy pages
  legal: {
    name: "DepCheck",
    country: "Romania",
    companyName: "Filip Frîncu PFA",
  },
  // Contact information. Can be found in the footer and contact page
  contact: {
    email: "contact@indiedev.pro",
  },
};

export const socialIcons = Object.entries(siteConfig.socialLinks).map(
  ([name, link]) => ({
    href: link,
    icon: name as IconLinkType,
  })
);

export interface SiteConfig {
  host: string;
  name: string;
  description: string;
  routes: Route[];
  legalRoutes: Route[];
  socialLinks: SocialLink;
  appLinks: Apps;
  sponsorLink?: string;
  legal: Legal;
  contact: Contact;
}

interface Route {
  label: string;
  href: string;
  publishedAt?: string;
}

type SocialLink = Partial<Record<IconLinkType, string>>;

interface Apps {
  appStore: string;
  googlePlay: string;
  web: string;
}

interface Legal {
  name: string;
  country: string;
  companyName: string;
}

interface Contact {
  email: string;
}
