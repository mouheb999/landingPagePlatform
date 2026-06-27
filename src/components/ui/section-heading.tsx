import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "text-start",
        className
      )}
    >
      {kicker && (
        <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
          {kicker}
        </span>
      )}
      <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </Reveal>
  );
}
