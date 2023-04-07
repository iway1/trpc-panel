import { useRef, useEffect } from "react";

type Key =
  | "Alt"
  | "AltGraph"
  | "CapsLock"
  | "Control"
  | "Fn"
  | "FnLock"
  | "Hyper"
  | "Meta"
  | "NumLock"
  | "ScrollLock"
  | "Shift"
  | "Super"
  | "Symbol"
  | "SymbolLock"
  | "Backspace"
  | "Tab"
  | "Enter"
  | "Escape"
  | "Space"
  | "PageUp"
  | "PageDown"
  | "End"
  | "Home"
  | "ArrowLeft"
  | "ArrowUp"
  | "ArrowRight"
  | "ArrowDown"
  | "Insert"
  | "Delete"
  | "ContextMenu"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "z";

export function useHotKey({
  key,
  callback,
  active,
}: {
  key: Key;
  callback: () => void;
  active?: boolean;
}) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const hasFiredRef = useRef(false);
  const controlOrMetaDown = useRef(false);
  useEffect(() => {
    if (active === false) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Control" || e.key === "Meta") {
        controlOrMetaDown.current = true;
        return;
      }
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        controlOrMetaDown.current &&
        !hasFiredRef.current
      ) {
        e.cancelBubble = true;
        e.preventDefault();
        callbackRef.current();
        hasFiredRef.current = true;
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.cancelBubble = true;
        e.preventDefault();
        hasFiredRef.current = false;
      }
      if (e.key === "Control" || e.key === "Meta") {
        controlOrMetaDown.current = false;
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [key, active]);
}
