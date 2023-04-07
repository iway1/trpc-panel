import React, { useState } from "react";
import { ChevronIcon } from "../../icons/ChevronIcon";

export function StackTrace({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col bg-gray-50 rounded-md border border-gray-500 overflow-hidden shadow-sm">
      <button
        className="flex flex-row items-center bg-gray-100 p-4 rounded-t-md justify-between bg-white font-bold"
        onClick={() => setOpen((val) => !val)}
        type="button"
      >
        Stack Trace{" "}
        <ChevronIcon
          className={"ml-2 w-4 h-4 " + (!open ? "rotate-180" : "-rotate-90")}
        />
      </button>
      {open && (
        <div className="max-h-64 p-4 overflow-scroll whitespace-pre bg-light">
          {text}
        </div>
      )}
    </div>
  );
}
