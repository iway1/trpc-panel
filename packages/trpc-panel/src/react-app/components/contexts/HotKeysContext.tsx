import { useSearch } from "@src/react-app/components/contexts/SearchStore";
import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface HotKeysContext {
  attachEventListeners: (element: Node | null) => void;
  removeEventListeners: (element: Node | null) => void;
}

const HotKeysContext = createContext<HotKeysContext | null>(null);

export function HotKeysContextProvider({ children }: { children: ReactNode }) {
  const searchOpen = useSearch((s) => s.searchOpen);
  const setSearchOpen = useSearch((s) => s.setSearchOpen);

  const toggleSearch = useCallback(
    () => setSearchOpen(!searchOpen),
    [searchOpen]
  );
  useHotkeys("ctrl+p, meta+p", toggleSearch, {
    preventDefault: true,
  });

  const keydownHandler = useCallback(
    (e: KeyboardEvent) => {
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      if (e.key.toUpperCase() === "P" && ctrlOrMeta) {
        toggleSearch();
      }
    },
    [toggleSearch]
  );

  return (
    <HotKeysContext.Provider
      value={{
        attachEventListeners: (element) => {
          element?.addEventListener("keydown", keydownHandler);
        },
        removeEventListeners: (element) => {
          element?.removeEventListener("keydown", keydownHandler);
        },
      }}
    >
      {children}
    </HotKeysContext.Provider>
  );
}

export function useHotKeysContext() {
  const ctx = useContext(HotKeysContext);
  if (!ctx) throw new Error("No HotKeysContextProvider found.");
  return ctx;
}

export function useEnableInputGlobalHotkeys(
  ref: MutableRefObject<null | HTMLInputElement>,
  deps?: any[]
) {
  const { attachEventListeners, removeEventListeners } = useHotKeysContext();
  useEffect(() => {
    attachEventListeners(ref.current);
    return () => {
      removeEventListeners(ref.current);
    };
  }, deps);
}
