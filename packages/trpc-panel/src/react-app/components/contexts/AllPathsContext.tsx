import React, { useContext } from "react";
import { ParsedProcedure } from "@src/parse/parseProcedure";
import { ParsedRouter } from "@src/parse/parseRouter";
import { createContext, ReactNode, useMemo } from "react";
import { ColorSchemeType } from "@src/react-app/components/CollapsableSection";
import { colorSchemeForNode } from "@src/react-app/components/style-utils";

const Context = createContext<{
  pathsArray: string[];
  colorSchemeForNode: { [path: string]: ColorSchemeType };
} | null>(null);

function flatten(
  node: ParsedRouter | ParsedProcedure
): [string, ColorSchemeType][] {
  let r: [string, ColorSchemeType][] = [];
  const colorSchemeType = colorSchemeForNode(node);
  if (node.nodeType === "router") {
    const o = Object.values(node.children)
      .map(flatten)
      .reduce((a, b) => [...a, ...b]);
    return [...r, ...o, [node.path.join("."), colorSchemeType]];
  }

  return [...r, [node.pathFromRootRouter.join("."), colorSchemeType]];
}

export function AllPathsContextProvider({
  rootRouter,
  children,
}: {
  rootRouter: ParsedRouter;
  children: ReactNode;
}) {
  const flattened = useMemo(() => flatten(rootRouter), []);
  const pathsArray = useMemo(() => {
    return flattened.map((e) => e[0]);
  }, []);
  const colorSchemeForNode = useMemo(() => Object.fromEntries(flattened), []);
  return (
    <Context.Provider
      value={{
        pathsArray,
        colorSchemeForNode,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAllPaths() {
  const ctx = useContext(Context);
  if (ctx === null) throw new Error("AllPathsContextProvider not found.");
  return ctx;
}
