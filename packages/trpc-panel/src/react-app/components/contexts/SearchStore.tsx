import { create } from "zustand";

(()=>{
  // ssr for dev app
  if(typeof window === 'undefined') {
    return;
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "p" && event.metaKey) {
      event.preventDefault();
    }
  });
})()

interface SearchStore {
  searchOpen: boolean;
  searchText: string;
  setSearchOpen: (open: boolean) => void;
  setSearchText: (text: string) => void;
  finish: () => void;
}

export const useSearch = create<SearchStore>((set) => ({
  searchOpen: false,
  searchText: "",
  setSearchOpen: (value) => {
    set({ searchOpen: value });
  },
  setSearchText: (value) => {
    set({ searchText: value });
  },
  finish: () => {
    set({ searchOpen: false, searchText: "" });
  },
}));
