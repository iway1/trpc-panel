import React from "react";

export function FormLabel({ children }: { children: string }) {
  return <span className="text-md text-neutralText font-bold">{children}</span>;
}
