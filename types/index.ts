import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type IconLinkType =
  | "devto"
  | "email"
  | "medium"
  | "facebook"
  | "github"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "x";
