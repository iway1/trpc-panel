import React, { createContext, ReactNode, useContext, useState } from "react";
// =D
document.addEventListener("keydown", function (event) {
  if (event.key === "p" && event.metaKey) {
    event.preventDefault();
  }
});

const Context = createContext<{
  searchOpen: boolean;
  searchText: string;
  setSearchOpen: (open: boolean) => void;
  setSearchText: (text: string) => void;
  finish: () => void;
} | null>(null);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <Context.Provider
      value={{
        searchOpen,
        searchText,
        setSearchOpen,
        setSearchText,
        finish: () => {
          setSearchText("");
          setSearchOpen(false);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("No SearchContext");
  }
  return ctx;
}
