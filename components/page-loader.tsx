import { Spinner } from "@nextui-org/spinner";
import { SpinnerVariantProps } from "@nextui-org/theme";
import clsx from "clsx";

interface PageLoaderProps {
  color?: SpinnerVariantProps["color"];
  label?: string;
  type?: "absolute" | "relative";
}

const SIZE = "w-14 h-14";

export function PageLoader({
  color = "primary",
  label,
  type = "absolute",
}: PageLoaderProps) {
  const spinner = (
    <Spinner
      classNames={{
        wrapper: SIZE,
        circle1: SIZE,
        circle2: SIZE,
        label: "text-xl text-center text-default-500 mt-8",
      }}
      label={label}
      color={color}
      size="lg"
    />
  );

  return (
    <div
      className={clsx({
        ["max-w-max absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"]:
          type === "absolute",
        ["flex justify-center mt-60"]: type === "relative",
      })}
    >
      {spinner}
    </div>
  );
}
