import clsx from "clsx";
import { Card, CardProps } from "@nextui-org/card";

export const BlurredCard = ({ children, className, ...rest }: CardProps) => {
  return (
    <Card isBlurred className={clsx("bg-default-100/50", className)} {...rest}>
      {children}
    </Card>
  );
};
