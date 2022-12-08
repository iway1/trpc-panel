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
    scrollToPathIfMatches: (path: string[], element: Element) => void;
    markForScrollTo: (path: string[]) => void;
} | null>(null);

function forAllPaths(path: string[], callback: (current: string) => void) {
    const cur: string[] = [];
    for (var next of path) {
        cur.push(next);
        const joined = cur.join(".");
        callback(joined);
    }
}

export function CollapsableContextProvider({
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
            return;
        }
        scrollToPathRef.current = null;
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }

    function markForScrollTo(path: string[]) {
        scrollToPathRef.current = path;
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
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useCollapsableContext() {
    const context = useContext(Context);
    if (context === null)
        throw new Error(
            "useCollapsableContext must be called from within a CollapsableContext"
        );
    return context;
}
