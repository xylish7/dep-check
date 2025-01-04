import { ReactElement, cloneElement } from "react";
import { IconProps } from "@phosphor-icons/react";
import clsx from "clsx";

import { ColorType } from "@/shared/types";
import { getTextColor, title } from "@/utils/primitives";

interface DataPlaceholderProps {
  actions?: ReactElement[];
  color?: ColorType;
  icon: ReactElement<IconProps>;
  position?: "center" | "top";
  subtitle?: string;
  title?: string;
}

export function DataPlaceholder({
  actions = [],
  color = "primary",
  icon,
  position = "center",
  subtitle,
  title: titleProp,
}: DataPlaceholderProps) {
  const iconElement = cloneElement(icon, {
    size: 72,
    className: clsx("mb-2", getTextColor(color), icon.props.className),
    weight: "duotone",
  });

  return (
    <div
      className={clsx({
        "my-48 flex items-center justify-center": position === "top",
        "flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full":
          position === "center",
      })}
    >
      <div className="flex flex-col items-center">
        {iconElement}
        <h1 className={title({ color, className: "text-center" })}>
          {titleProp}
        </h1>
        {Boolean(subtitle) && (
          <p className="text-2xl text-default-500 font-semibold mt-3 text-center">
            {subtitle}
          </p>
        )}
        {Boolean(actions.length) && (
          <div className=" flex gap-4 mt-8">
            {actions.map((action) => action)}
          </div>
        )}
      </div>
    </div>
  );
}
