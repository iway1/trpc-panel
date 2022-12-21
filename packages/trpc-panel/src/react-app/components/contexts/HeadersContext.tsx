import { createContext, useContext, useRef, useState } from "react";
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

const storedHeaders = localStorage.getItem(headersLocalStorageKey);

export function useHeaders(): HeadersContextType {
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
      localStorage.setItem(headersLocalStorageKey, JSON.stringify(headers));
    }
  }

  function getHeaders() {
    return {
      ...globalHeadersRef.current,
    };
  }

  return {
    setHeaders,
    getHeaders,
    headersPopupShown,
    setHeadersPopupShown,
    saveHeadersToLocalStorage,
    setSaveHeadersToLocalStorage: (val) => {
      if (!val) localStorage.removeItem(headersLocalStorageKey);
      setSaveHeadersToLocalStorage(val);
    },
  };
}

export function useHeadersContext() {
  const context = useContext(HeadersContext);
  if (context === null)
    throw new Error(
      "useHeadersContext must be called from within a HeadersContextProvider"
    );
  return context;
}
