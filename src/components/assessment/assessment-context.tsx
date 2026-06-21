"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AssessmentModal } from "./assessment-modal";

interface AssessmentContextValue {
  open: () => void;
  close: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within <AssessmentProvider>");
  }
  return ctx;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AssessmentContext.Provider value={{ open, close }}>
      {children}
      <AssessmentModal open={isOpen} onOpenChange={setIsOpen} />
    </AssessmentContext.Provider>
  );
}
