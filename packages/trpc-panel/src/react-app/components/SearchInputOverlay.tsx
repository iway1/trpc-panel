import { useAllPaths } from "@src/react-app/components/contexts/AllPathsContext";
import { useEnableInputGlobalHotkeys } from "@src/react-app/components/contexts/HotKeysContext";
import { useSearch } from "@src/react-app/components/contexts/SearchStore";
import { useSiteNavigationContext } from "@src/react-app/components/contexts/SiteNavigationContext";
import { ItemTypeIcon } from "@src/react-app/components/ItemTypeIcon";
import fuzzysort from "fuzzysort";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  FocusEventHandler,
  ReactNode,
} from "react";

export function useFuzzySort({
  paths,
  searchingFor,
  limit = 50,
}: {
  paths: string[];
  searchingFor: string;
  limit?: number;
}) {
  return useMemo(() => {
    return fuzzysort.go(searchingFor, paths, {
      limit,
      all: true,
    });
  }, [paths, searchingFor]);
}

export function SearchOverlay({ children }: { children: ReactNode }) {
  const searchOpen = useSearch((s) => s.searchOpen);
  return (
    <>
      {children}
      {searchOpen && (
        <div className="fixed flex flex-col pt-3 left-0 right-0 top-0 pointer-events-none items-center">
          <SearchInput />
        </div>
      )}
    </>
  );
}

function SearchInput() {
  const searchText = useSearch((s) => s.searchText);
  const setSearchText = useSearch((s) => s.setSearchText);
  const finish = useSearch((s) => s.finish);
  const { openAndNavigateTo } = useSiteNavigationContext();
  const paths = useAllPaths();
  const results = useFuzzySort({
    paths: paths.pathsArray,
    searchingFor: searchText,
  });
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);

  const divRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const firstResultRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function arrowKeyListener(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        // Set focus to the next element
        if (
          document.activeElement === inputRef.current! &&
          firstResultRef.current
        ) {
          setSelectedResultIndex((s) => Math.min(s + 1, results.length - 1));
          event.preventDefault();
          return;
        }
        (
          document.activeElement?.parentElement?.nextElementSibling
            ?.children[0] as HTMLElement
        )?.focus();
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        // Set focus to the previous element
        setSelectedResultIndex((e) => Math.max(0, e - 1));
        event.preventDefault();
        return;
      }
    }

    document.addEventListener("keydown", arrowKeyListener);
    return () => {
      document.removeEventListener("keydown", arrowKeyListener);
    };
  }, []);

  useEnableInputGlobalHotkeys(inputRef, []);

  useEffect(() => {
    function inputEventListener(event: KeyboardEvent) {
      if (event.key === "Enter") {
        pathSelectedHandler(selectedResultIndex);
      }
    }
    inputRef.current?.addEventListener("keydown", inputEventListener);
    return () => {
      inputRef.current?.removeEventListener("keydown", inputEventListener);
    };
  }, [selectedResultIndex, results]);

  useEffect(() => {
    const node = document.getElementById(
      "search-result-" + selectedResultIndex
    );
    node?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedResultIndex]);

  const onBlur: FocusEventHandler<HTMLElement> = (e) => {
    if (!divRef.current?.contains(e.relatedTarget)) {
      finish();
    }
  };

  function pathSelectedHandler(index: number) {
    const selected = results[index];
    if (!selected) return;
    openAndNavigateTo(selected.target.split("."), true);
    finish();
  }

  function onTextChange(text: string) {
    setSelectedResultIndex(0);
    setSearchText(text);
  }

  return (
    <div
      ref={divRef}
      className="min-w-[40rem] pointer-events-auto overflow-visible rounded-md flex flex-col border-neutralBgVeryDark border drop-shadow-md bg-white p-1 rounded-t-md z-50"
    >
      <input
        className="p-1 rounded-sm border self-stretch bg-neutralBgDark"
        value={searchText}
        onChange={(e) => onTextChange(e.target.value)}
        ref={inputRef}
        onBlur={onBlur}
      />
      {results && (
        <ul className="max-h-[24rem] overflow-scroll">
          {results.map((e, i) => (
            <li
              key={e.target}
              className="truncate h-[1.8rem] mt-[0.2rem] px-1 flex-row"
            >
              <button
                ref={i === 0 ? firstResultRef : undefined}
                onBlur={onBlur}
                onFocus={() => setSelectedResultIndex(i)}
                className={
                  "w-full text-left h-full flex flex-row rounded-sm items-center  px-1 focus:outline-none border-transparent focus:border-transparent focus:ring-0 " +
                  (i === selectedResultIndex
                    ? "bg-selectedListItem text-white"
                    : "text-neutralSolid")
                }
                type="button"
                // seems easier than an array of refs?
                id={"search-result-" + i}
                onClick={() => pathSelectedHandler(i)}
              >
                <ItemTypeIcon
                  colorScheme={paths.colorSchemeForNode[e.target]!}
                />
                {e.target}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
