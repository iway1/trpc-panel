import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";

const Context = createContext<{
  has: (path: string[]) => boolean;
  hidePath: (path: string[]) => void;
  showPath: (path: string[]) => void;
  togglePath: (path: string[]) => void;
  scrollToPathIfMatches: (path: string[], element: Element) => boolean;
  markForScrollTo: (path: string[]) => void;
  openAndNavigateTo: (path: string[], closeOthers?: boolean) => void;
} | null>(null);

function forAllPaths(path: string[], callback: (current: string) => void) {
  const cur: string[] = [];
  for (var next of path) {
    cur.push(next);
    const joined = cur.join(".");
    callback(joined);
  }
}

export function SiteNavigationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [shownPaths, setShownPaths] = useState<Set<string>>(new Set());

  const scrollToPathRef = useRef<string[] | null>(null);

  function hidePath(path: string[]) {
    const newPaths = new Set<string>(shownPaths);
    const pathJoined = path.join(".");
    forAllPaths(path, (current) => {
      if (pathJoined.length <= current.length) newPaths.delete(current);
    });
    setShownPaths(newPaths);
  }

  function showPath(path: string[]) {
    const newPaths = new Set<string>(shownPaths);
    forAllPaths(path, (current) => {
      newPaths.add(current);
    });
    setShownPaths(newPaths);
  }

  function has(path: string[]) {
    return shownPaths.has(path.join("."));
  }

  function toggle(path: string[]) {
    if (has(path)) hidePath(path);
    else showPath(path);
  }

  function scrollToPathIfMatches(path: string[], element: Element) {
    if (
      !scrollToPathRef.current ||
      path.join(".") !== scrollToPathRef.current.join(".")
    ) {
      return false;
    }
    scrollToPathRef.current = null;
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
    return true;
  }

  function markForScrollTo(path: string[]) {
    scrollToPathRef.current = path;
  }

  function openAndNavigateTo(path: string[], hideOthers?: boolean) {
    const newSet = hideOthers ? new Set<string>() : new Set(shownPaths);
    forAllPaths(path, (p) => {
      newSet.add(p);
    });
    markForScrollTo(path);
    setShownPaths(newSet);
  }

  return (
    <Context.Provider
      value={{
        hidePath,
        showPath,
        has,
        togglePath: toggle,
        scrollToPathIfMatches,
        markForScrollTo,
        openAndNavigateTo,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSiteNavigationContext() {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      "useCollapsableContext must be called from within a CollapsableContext"
    );
  return context;
}
