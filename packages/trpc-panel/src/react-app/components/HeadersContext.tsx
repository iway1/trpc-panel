import { createContext, useContext, useRef, useState } from "react";
type Headers = { [key: string]: string };

type HeadersContextType = {
    getHeaders: () => Headers;
    setHeaders: (headers: Headers) => void;
    headersPopupShown: boolean;
    setHeadersPopupShown: (value: boolean) => void;
};

export const HeadersContext = createContext<HeadersContextType | null>(null);

export function useHeaders(): HeadersContextType {
    const [headersPopupShown, setHeadersPopupShown] = useState(false);
    const globalHeadersRef = useRef<Headers>({});

    function setHeaders(headers: Headers) {
        globalHeadersRef.current = headers;
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
