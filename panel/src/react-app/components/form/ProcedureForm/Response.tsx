import React from "react";
import { FormSection } from "./FormSection";

export function Response({ children }: { children: string }) {
    return (
        <FormSection title="Response">
            <p className="whitespace-pre font-mono">{children}</p>
        </FormSection>
    );
}
