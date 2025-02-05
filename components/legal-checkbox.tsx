import { Checkbox, CheckboxProps } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import clsx from "clsx";

export function LegalCheckbox({ className, ...rest }: CheckboxProps) {
  return (
    <div className={clsx("flex gap-2", className)}>
      <Checkbox aria-labelledby="legal" size="lg" {...rest} />
      <div id="legal">
        I have read and agree to the{" "}
        <Link
          className="inline"
          // href={siteConfig.legalRoutes[0].href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          className="inline"
          // href={siteConfig.legalRoutes[1].href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy Policy.
        </Link>
      </div>
    </div>
  );
}
