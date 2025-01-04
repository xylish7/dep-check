import { Link } from "@nextui-org/link";
import {
  DevToLogo,
  Envelope,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  TiktokLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";

import { ColorType, getTextColor } from "@/utils/primitives";
import { IconLinkType } from "@/types";

interface IconLinkProps {
  color?: ColorType;
  href?: string;
  icon: IconLinkType;
  size?: number;
}

export const IconLink = ({
  color = "default",
  href,
  icon,
  size = 32,
}: IconLinkProps) => {
  const iconClassName =
    color === "default" ? "text-default-500" : getTextColor(color);

  if (!href) {
    return null;
  }

  switch (icon) {
    case "email":
      return (
        <Link isExternal href={href} aria-label="Email">
          <Envelope className={iconClassName} size={size} />
        </Link>
      );
    case "github":
      return (
        <Link isExternal href={href} aria-label="Github">
          <GithubLogo className={iconClassName} size={size} />
        </Link>
      );
    case "facebook":
      return (
        <Link isExternal href={href} aria-label="Facebook">
          <FacebookLogo className={iconClassName} size={size} />
        </Link>
      );
    case "instagram":
      return (
        <Link isExternal href={href} aria-label="Instagram">
          <InstagramLogo className={iconClassName} size={size} />
        </Link>
      );
    case "linkedin":
      return (
        <Link isExternal href={href} aria-label="LinkedIn">
          <LinkedinLogo className={iconClassName} size={size} />
        </Link>
      );
    case "x":
      return (
        <Link isExternal href={href} aria-label="X">
          <XLogo className={iconClassName} size={size} />
        </Link>
      );

    case "devto":
      return (
        <Link isExternal href={href} aria-label="Dev.to">
          <DevToLogo className={iconClassName} size={size} />
        </Link>
      );
    case "medium":
      return (
        <Link isExternal href={href} aria-label="Medium">
          <MediumLogo className={iconClassName} size={size} />
        </Link>
      );
    case "tiktok":
      return (
        <Link isExternal href={href} aria-label="TikTok">
          <TiktokLogo className={iconClassName} size={size} />
        </Link>
      );
    default:
      return null;
  }
};
