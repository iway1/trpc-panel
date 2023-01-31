import React, { useContext } from "react";
import { createContext, ReactNode } from "react";

type ContextType = {
  path: string;
};

const Context = createContext<ContextType | null>(null);

export function ProcedureFormContextProvider({
  children,
  path,
}: {
  children: ReactNode;
  path: string;
}) {
  return <Context.Provider value={{ path }}>{children}</Context.Provider>;
}

export function useProcedureFormContext() {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error(
      "Procedure form context must be called within ProcedureFormContextProvider (this is a bug with trpc-panel, open an issue)."
    );
  return ctx;
}
