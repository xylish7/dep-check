"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Books, SignOut } from "@phosphor-icons/react/dist/ssr";

import { signOut } from "@/app/api/auth/actions";
import { ThemeSwitch } from "@/components/theme-switch";

interface NavbarProps {
  brandName: string;
}

export const LoggedInNavbar = ({ brandName }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="gap-3 max-w-fit">
        <Link
          className="flex justify-start items-center gap-2"
          color="foreground"
          href="/"
        >
          <Image alt="Logo" height={30} width={30} src="/images/logo.png" />
          <span className="font-bold text-lg">{brandName}</span>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="basis-1/5 sm:basis-full hidden lg:flex gap-4 justify-start"
        justify="start"
      >
        {navItems.map((item) => {
          const isHome =
            item.href === "/account/dashboard" &&
            pathname === "/account/dashboard";

          return (
            <NavbarItem
              className="data-[active=true]:text-primary !font-medium"
              isActive={
                isHome
                  ? true
                  : pathname.includes(item.href) &&
                    item.href !== "/account/dashboard"
              }
              key={item.href}
            >
              <Link
                className="text-inherit "
                color="foreground"
                size="sm"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent
        className="hidden lg:flex basis-1/5 sm:basis-full gap-2"
        justify="end"
      >
        <ThemeSwitch />
        <Button
          color="primary"
          size="sm"
          variant="flat"
          onPress={() => signOut()}
        >
          <SignOut size={16} /> Log out
        </Button>
      </NavbarContent>

      <NavbarContent className="lg:hidden basis-1 pl-4 gap-2" justify="end">
        <ThemeSwitch />
        <Button
          color="primary"
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => signOut()}
        >
          <SignOut size={16} />
        </Button>
      </NavbarContent>
    </NextUINavbar>
  );
};

export const navItems = [
  {
    label: "Dashboard",
    href: "/account/dashboard",
    icon: <Books size={22} />,
  },
];
