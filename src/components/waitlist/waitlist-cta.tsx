"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { scrollToWaitlist } from "@/lib/scroll";

interface WaitlistCtaProps extends Omit<ButtonProps, "onClick"> {
  children: ReactNode;
}

export function WaitlistCta({ children, ...props }: WaitlistCtaProps) {
  return (
    <Button onClick={scrollToWaitlist} {...props}>
      {children}
    </Button>
  );
}
