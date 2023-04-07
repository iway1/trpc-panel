import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
type Headers = { [key: string]: string };

type HeadersContextType = {
  getHeaders: () => Headers;
  setHeaders: (headers: Headers) => void;
  headersPopupShown: boolean;
  setHeadersPopupShown: (value: boolean) => void;
  saveHeadersToLocalStorage: boolean;
  setSaveHeadersToLocalStorage: (val: boolean) => void;
};

export const HeadersContext = createContext<HeadersContextType | null>(null);

const headersLocalStorageKey = "headers";

// necessary for SSR in the dev app
const storage = typeof window !== 'undefined'? localStorage: {getItem: (v: string)=>null, setItem: (s: string)=>{}, removeItem: (v: string)=>{}};

const storedHeaders = storage.getItem(headersLocalStorageKey);

export function HeadersContextProvider({ children }: { children: ReactNode }) {
  const [headersPopupShown, setHeadersPopupShown] = useState(false);
  const [saveHeadersToLocalStorage, setSaveHeadersToLocalStorage] = useState(
    !!storedHeaders
  );
  const globalHeadersRef = useRef<Headers>(
    storedHeaders ? JSON.parse(storedHeaders) : {}
  );

  function setHeaders(headers: Headers) {
    globalHeadersRef.current = headers;
    if (saveHeadersToLocalStorage) {
      storage.setItem(headersLocalStorageKey, JSON.stringify(headers));
    }
  }

  function getHeaders() {
    return {
      ...globalHeadersRef.current,
    };
  }

  return (
    <HeadersContext.Provider
      value={{
        setHeaders,
        getHeaders,
        headersPopupShown,
        setHeadersPopupShown,
        saveHeadersToLocalStorage,
        setSaveHeadersToLocalStorage: (val) => {
          if (!val) storage.removeItem(headersLocalStorageKey);
          setSaveHeadersToLocalStorage(val);
        },
      }}
    >
      {children}
    </HeadersContext.Provider>
  );
}

export function useHeaders(): HeadersContextType {
  const ctx = useContext(HeadersContext);
  if (!ctx) throw new Error("No headers context.");
  return ctx;
}

export function useHeadersContext() {
  const context = useContext(HeadersContext);
  if (context === null)
    throw new Error(
      "useHeadersContext must be called from within a HeadersContextProvider"
    );
  return context;
}
