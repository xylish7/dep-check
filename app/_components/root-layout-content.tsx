"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";
import { siteConfig, socialIcons } from "@/config/site";
import { Navbar as MainNavbar } from "@/components/navbar";
import { LoggedInNavbar } from "@/components/logged-in-navbar";

const mainRoutes = [
  ...siteConfig.routes.filter((route) => route.href !== "/account/dashboard"),
  ...siteConfig.legalRoutes,
].map((route) => route.href);

export default function RootLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isMainRoute = mainRoutes.includes(pathname);

  if (isMainRoute) {
    return <MainContent>{children}</MainContent>;
  }

  return <UserContent>{children}</UserContent>;
}

function MainContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <MainNavbar
        brandName={siteConfig.name}
        navItems={siteConfig.routes}
        socials={socialIcons}
        sponsorLink={siteConfig.sponsorLink}
      />
      <main className="relative container mx-auto max-w-7xl px-6 min-h-[50vh]">
        {children}
      </main>
      <Footer
        contactEmail={siteConfig.contact.email}
        copyright={siteConfig.name}
        legalNavItems={siteConfig.legalRoutes}
        navItems={siteConfig.routes}
        socials={socialIcons}
      />
    </div>
  );
}

function UserContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-14 lg:pb-0">
      <LoggedInNavbar brandName={siteConfig.name} />
      <main className="relative h-[calc(100vh-122px)] lg:min-h-[75vh] lg:h-auto overflow-auto container mx-auto max-w-7xl px-6 pb-10">
        {children}
      </main>
    </div>
  );
}
