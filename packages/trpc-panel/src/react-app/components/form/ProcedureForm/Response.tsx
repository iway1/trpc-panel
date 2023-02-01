import React from "react";
import { FormSection } from "./FormSection";

export function Response({ children }: { children: string }) {
  return (
    <FormSection title="Response">
      <p className="font-mono whitespace-pre-wrap break-words">{children}</p>
    </FormSection>
  );
}
