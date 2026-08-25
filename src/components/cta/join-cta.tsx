import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { JOIN_URL } from "@/lib/platform";

type JoinCtaProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
};

/**
 * The one outbound CTA on the site.
 *
 * An anchor, not a button with an onClick — which means it needs no JavaScript,
 * works in a new tab on middle-click, and is a real link to a crawler. The
 * component it replaces (`WaitlistCta`) had to be a Client Component purely to
 * scroll the page down to a form.
 *
 * Same tab on purpose: this is a handover, not a detour.
 */
export function JoinCta({ children, className, size, variant }: JoinCtaProps) {
  return (
    <a href={JOIN_URL} className={cn(buttonVariants({ size, variant }), className)}>
      {children}
    </a>
  );
}
