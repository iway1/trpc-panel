import { useAllPaths } from "@src/react-app/components/contexts/AllPathsContext";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from "react";
import { create } from "zustand";

const Context = createContext<{
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

const collapsablesStore = {
  current: null as null | ReturnType<typeof create>,
};

function initialCollapsableStoreValues(allPaths: string[]) {
  const vals: Record<string, boolean> = {};

  for (const path of allPaths) {
    vals[path] = false;
  }
  return vals;
}

function initCollapsablesStore(allPaths: string[]) {
  collapsablesStore.current = create<any>(() => ({
    ...initialCollapsableStoreValues(allPaths),
  }));
}

function useInitCollapsablesStore(allPaths: string[]) {
  const hasInitted = useRef(false);

  if (!hasInitted.current) {
    initCollapsablesStore(allPaths);
    hasInitted.current = true;
  }
}

export const collapsables = (() => {
  const hide = (path: string[]) => {
    const pathJoined = path.join(".");
    forAllPaths(path, (current) => {
      if (pathJoined.length <= current.length) {
        collapsablesStore.current?.setState({
          [current]: false,
        });
      }
    });
  };
  const show = (path: string[]) => {
    forAllPaths(path, (current) => {
      collapsablesStore.current?.setState({
        [current]: true,
      });
    });
  };
  return {
    hide,
    show,
    toggle(path: string[]) {
      const state = collapsablesStore.current!.getState() as any;
      if (state[path.join(".")]) {
        hide(path);
      } else {
        show(path);
      }
    },
    hideAll() {
      const state = collapsablesStore.current! as any;
      const newValue: Record<string, boolean> = {};
      for (const path in state) {
        newValue[path] = false;
      }
      collapsablesStore.current!.setState(newValue);
    },
  };
})();

export function useCollapsableIsShowing(path: string[]) {
  const p = useMemo(() => {
    return path.join(".");
  }, []);
  return collapsablesStore.current!((s) => (s as any)[p]);
}

export function SiteNavigationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const allPaths = useAllPaths();
  useInitCollapsablesStore(allPaths.pathsArray);

  const scrollToPathRef = useRef<string[] | null>(null);

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
    if (hideOthers) {
      collapsables.hideAll();
    }
    collapsables.show(path);
    markForScrollTo(path);
  }

  return (
    <Context.Provider
      value={{
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
