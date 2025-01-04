import Image from "next/image";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";

import { IconLinkType } from "@/types";
import { IconLink } from "./icon-link";
import { socialIcons } from "@/config/site";

interface FooterProps {
  copyright: string;
  contactEmail: string;
  legalNavItems: NavItem[];
  navItems: NavItem[];
  socials: SocialItem[];
}

export const Footer = ({
  copyright,
  contactEmail,
  legalNavItems,
  navItems,
}: FooterProps) => {
  return (
    <footer className="relative container mx-auto max-w-7xl mb-24 mt-32 lg:mt-48 px-6 flex-grow">
      <Divider className="mb-10" orientation="horizontal" />

      <div className="flex flex-col sm:flex-row sm:justify-between">
        {/* Left side */}
        <div className="flex flex-col items-center sm:items-start gap-5">
          {/* Social links */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span>Follow us</span>
            <div className="flex gap-3">
              {socialIcons.map((social, index) => (
                <IconLink key={index} {...social} />
              ))}
            </div>
          </div>

          {/* Contact links */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span>Contact us</span>
            <IconLink href={`mailto:${contactEmail}`} icon="email" />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center sm:grid sm:grid-rows-3 grid-flow-col gap-y-2 gap-x-16 h-max mt-4 sm:mt-0">
          {navItems.map((navItem) => (
            <Link color="foreground" key={navItem.href} href={navItem.href}>
              {navItem.label}
            </Link>
          ))}
          {/* Legal links */}
          {legalNavItems.map((navItem) => (
            <Link color="foreground" key={navItem.href} href={navItem.href}>
              {navItem.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="flex items-center justify-center mt-14">
        <Image
          alt="Logo"
          className="mr-3"
          src="/images/logo.png"
          width={30}
          height={30}
        />
        <span className="text-default-600">
          © {copyright} {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

interface NavItem {
  href: string;
  label: string;
}

interface SocialItem {
  href: string;
  icon: IconLinkType;
}
