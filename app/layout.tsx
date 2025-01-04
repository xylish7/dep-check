import { ReactNode } from "react";
import { Metadata, Viewport } from "next";

import { fontPoppins } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Providers } from "@/providers";
import { Notification } from "@/providers/notification";
import RootLayoutContent from "./_components/root-layout-content";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.host),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  keywords: [],
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    // images: ogImageUrl,
    siteName: siteConfig.name,
    url: siteConfig.host,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Used to suppress hydration warning due to next-themes package being used
    // See more info here: https://github.com/vercel/next.js/discussions/22388
    <html className={fontPoppins.className} lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background antialiased">
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Notification />
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}
