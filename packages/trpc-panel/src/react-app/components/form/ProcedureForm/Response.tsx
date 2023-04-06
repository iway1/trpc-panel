import React from "react";
import { FormSection } from "./FormSection";
import { JsonViewer } from "@textea/json-viewer";

export function Response({ children }: { children: string | object }) {
  if (typeof children === "object") {
    return (
      <FormSection title="Response">
        <JsonViewer rootName={false} value={children} quotesOnKeys={false} />
      </FormSection>
    );
  }

  return (
    <FormSection title="Response">
      <p className="font-mono whitespace-pre-wrap break-words">{children}</p>
    </FormSection>
  );
}
