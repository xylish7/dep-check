import { tv } from "tailwind-variants";

export const colorTypes: ColorType[] = [
  "danger",
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
];

const gradientMap: Record<ColorType, string> = {
  danger:
    "from-danger-300 to-danger-500 dark:from-danger-800 dark:to-danger-400",
  default: "from-black to-black dark:from-white dark:to-white",
  primary:
    "from-primary-300 to-primary-500 dark:from-primary-800 dark:to-primary-400",
  secondary:
    "from-secondary-300 to-secondary-500 dark:from-secondary-800 dark:to-secondary-400",
  success:
    "from-success-300 to-success-500 dark:from-success-800 dark:to-success-400",
  warning:
    "from-warning-300 to-warning-500 dark:from-warning-800 dark:to-warning-400",
};

export const title = tv({
  base: "tracking-tight inline font-bold",
  variants: {
    color: gradientMap,
    size: {
      sm: "text-2xl lg:text-3xl font-semibold",
      md: "text-3xl lg:text-4xl lg:leading-12!",
      lg: "text-4xl lg:text-5xl leading-12 lg:leading-20!",
      xl: "text-5xl lg:text-6xl leading-12 lg:leading-20!",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
  compoundVariants: [
    {
      color: colorTypes,
      class: "bg-clip-text text-transparent bg-linear-to-b",
    },
  ],
});

export const p = tv({
  base: "my-3",
  variants: {
    color: {
      "500": "text-default-500",
      "600": "text-default-600",
    },
    size: {
      sm: "text-md",
      md: "text-lg lg:text-xl",
      lg: "text-xl lg:text-2xl",
    },
    width: {
      full: "w-full!",
      fraction: "w-full sm:w-3/4 md:w-2/3",
    },
  },
  defaultVariants: {
    color: "600",
    size: "md",
  },
});

export function getTextColor(color?: ColorType | unknown) {
  switch (color) {
    case "danger":
      return "text-danger";
    case "default":
      return "text-black dark:text-white";
    case "primary":
      return "text-primary";
    case "secondary":
      return "text-secondary";
    case "success":
      return "text-success";
    case "warning":
      return "text-warning";
    default:
      return undefined;
  }
}

export function getBorderColor(color?: ColorType | unknown) {
  switch (color) {
    case "danger":
      return "border-danger";
    case "default":
      return "border-default";
    case "primary":
      return "border-primary";
    case "secondary":
      return "border-secondary";
    case "success":
      return "border-success";
    case "warning":
      return "border-warning";
    default:
      return undefined;
  }
}

export type ColorType =
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning";
