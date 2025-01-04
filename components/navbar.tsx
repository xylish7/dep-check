"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { Heart, UserCircle } from "@phosphor-icons/react/dist/ssr";

import { ThemeSwitch } from "@/components/theme-switch";
import { IconLinkType } from "@/types";
import { IconLink } from "./icon-link";

interface NavbarProps {
  brandName: string;
  navItems: NavItem[];
  socials: Social[];
  sponsorLink?: string;
}

export const Navbar = ({
  brandName,
  navItems,
  socials,
  sponsorLink,
}: NavbarProps) => {
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
          <span className="font-bold ml-1 mt-1 text-lg">{brandName}</span>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="basis-1/5 sm:basis-full hidden lg:flex gap-4 justify-start"
        justify="start"
      >
        {navItems.map((item) => {
          const isHome = item.href === "/" && pathname === "/";

          return (
            <NavbarItem
              className="data-[active=true]:text-primary !font-medium"
              isActive={
                isHome ? true : pathname === item.href && item.href !== "/"
              }
              key={item.href}
            >
              <Link
                className="text-inherit"
                color="foreground"
                href={item.href}
                size="sm"
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full gap-2"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex gap-2">
          {socials.map((social, index) => (
            <IconLink key={index} {...social} size={22} />
          ))}
        </NavbarItem>
        <NavbarItem className="hidden lg:flex mb-1">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex"></NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <AccountButton />
        </NavbarItem>
        {sponsorLink ? (
          <NavbarItem className="hidden lg:flex">
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={sponsorLink}
              startContent={
                <Heart className="text-danger" size={22} weight="fill" />
              }
              variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem>
        ) : null}
      </NavbarContent>

      <NavbarContent className="lg:hidden basis-1 pl-4 gap-3" justify="end">
        {sponsorLink ? (
          <NavbarItem>
            <Link isExternal href={sponsorLink}>
              <Heart className="text-danger" size={22} weight="fill" />
            </Link>
          </NavbarItem>
        ) : null}
        <NavbarItem className="h-6">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem></NavbarItem>
        <NavbarItem>
          <AccountButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenuToggle
        className="lg:hidden"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      />

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.href}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          {sponsorLink ? (
            <NavbarMenuItem>
              <Link
                className="text-danger"
                href={sponsorLink}
                isExternal
                size="lg"
              >
                Sponsor <Heart className="ml-3" size={22} weight="fill" />
              </Link>
            </NavbarMenuItem>
          ) : null}
          <NavbarMenuItem className="flex gap-3 mt-8">
            {socials.map((social, index) => (
              <IconLink key={index} {...social} size={26} />
            ))}
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

function AccountButton() {
  return (
    <>
      <Link
        className={buttonStyles({
          className: "lg:hidden",
          isIconOnly: true,
          color: "primary",
          size: "sm",
          variant: "flat",
        })}
        href="/account"
        aria-label="Contul meu"
      >
        <UserCircle size={18} />
      </Link>
      <Link
        className={buttonStyles({
          className: "hidden lg:flex",
          color: "primary",
          size: "sm",
          variant: "flat",
        })}
        href="/account"
      >
        <UserCircle size={18} />
        My account
      </Link>
    </>
  );
}

interface NavItem {
  href: string;
  label: string;
}

interface Social {
  href: string;
  icon: IconLinkType;
}
