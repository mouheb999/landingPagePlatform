"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAssessment } from "./assessment-context";

interface AssessmentTriggerProps extends Omit<ButtonProps, "onClick"> {
  children: ReactNode;
}

export function AssessmentTrigger({ children, ...props }: AssessmentTriggerProps) {
  const { open } = useAssessment();
  return (
    <Button onClick={open} {...props}>
      {children}
    </Button>
  );
}
