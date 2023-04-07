import { useMemo } from "react";

export function useIsMac() {
  return useMemo(() => {
    if(typeof window === 'undefined') return false;
    return navigator.userAgent.indexOf("Mac") !== -1;
  }, []);
}
