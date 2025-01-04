import { ColorType, p, title as titleUtility } from "@/utils/primitives";

interface PageHeadingProps {
  color?: ColorType;
  subtitle?: string;
  title: string;
}

export const PageHeading = ({ color, subtitle, title }: PageHeadingProps) => {
  return (
    <div className="flex flex-col items-center my-16 lg:my-32">
      <h1
        className={titleUtility({
          color,
          className: "text-center",
          size: "lg",
        })}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className={p({ className: "text-center", size: "lg" })}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
