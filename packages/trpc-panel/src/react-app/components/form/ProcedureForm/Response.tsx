import React from "react";
import { toast } from "react-hot-toast";
import { FormSection } from "./FormSection";

export function Response({ children }: { children: string }) {
  return (
    <FormSection title="Response">
      <button
        className="absolute top-4 right-4 p-1 rounded border hover:bg-neutralBg transition-colors"
        onClick={() => {
          navigator.clipboard.writeText(children);
          toast("Copied to clipboard", { icon: "📋" });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
          />
        </svg>
      </button>
      <p className="whitespace-pre font-mono">{children}</p>
    </FormSection>
  );
}
