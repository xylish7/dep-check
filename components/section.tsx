import { ReactNode } from "react";
import { ColorType, p, title as titleUtility } from "@/utils/primitives";
import { tv } from "tailwind-variants";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const Section = ({ children, className, ...rest }: SectionProps) => {
  return (
    <section
      className={tv({ base: "last:mb-0 my-16 lg:my-32" })({ className })}
      {...rest}
    >
      {children}
    </section>
  );
};

interface TitleProps {
  color: ColorType;
  subtitle?: string;
  title: string;
}

const Title = ({ color, subtitle, title }: TitleProps) => {
  return (
    <div className="flex flex-col items-center mb-16">
      <span
        className={titleUtility({
          color,
          className: "text-center pr-1",
          size: "md",
        })}
      >
        {title}
      </span>
      {subtitle ? (
        <p className={p({ className: "text-center", size: "lg" })}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

Section.Title = Title;
