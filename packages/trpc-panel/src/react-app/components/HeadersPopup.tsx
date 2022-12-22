import { useHeadersContext } from "@src/react-app/components/contexts/HeadersContext";
import React, { useEffect, useState } from "react";
import { BaseTextField } from "@src/react-app/components/form/fields/base/BaseTextField";
import { FieldError } from "@src/react-app/components/form/fields/FieldError";
import { Button } from "@src/react-app/components/Button";
import toast from "react-hot-toast";
import SaveIcon from "@mui/icons-material/Lock";
import XIcon from "@mui/icons-material/Close";
import { AddItemButton } from "@src/react-app/components/AddItemButton";

export function HeadersPopup() {
  const {
    headersPopupShown,
    setHeadersPopupShown,
    getHeaders,
    setHeaders: setContextHeaders,
    saveHeadersToLocalStorage,
    setSaveHeadersToLocalStorage,
  } = useHeadersContext();
  const [headers, setHeaders] = useState<[string, string][]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);

  function addHeader() {
    setHeaders((old) => [...old, ["", ""]]);
  }

  function clearErrorIfNecessary(index: number) {
    if (!errors[index]) return;
    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);
  }

  function update(index: number, value: string, type: "key" | "value") {
    const newHeaders = [...headers];
    const newValue = newHeaders[index]!;
    newValue[type == "key" ? 0 : 1] = value;
    newHeaders[index] = newValue;
    setHeaders(newHeaders);
    clearErrorIfNecessary(index);
  }

  function deleteHeader(index: number) {
    const newHeaders = [...headers];
    const newErrors = [...errors];
    newHeaders.splice(index, 1);
    newErrors.splice(index, 1);
    setHeaders(newHeaders);
    setErrors(newErrors);
  }

  function onExitPress() {
    setHeadersPopupShown(false);
  }

  function onConfirmClick() {
    var newErrors: boolean[] = [...errors];
    var i = 0;
    for (var [headerKey, headerValue] of headers) {
      if (!headerKey || !headerValue) {
        newErrors[i] = true;
      }
      i++;
    }
    if (newErrors.some((e) => e)) {
      setErrors(newErrors);
      return;
    }
    setContextHeaders(Object.fromEntries(headers));
    setHeadersPopupShown(false);
    toast("Headers updated.");
  }

  useEffect(() => {
    if (headersPopupShown) {
      setHeaders(Object.entries(getHeaders()));
    }
  }, [headersPopupShown]);
  if (!headersPopupShown) return null;
  return (
    <div className="fixed flex left-0 right-0 top-0 bottom-0 items-center border border-panelBorder drop-shadow-lg justify-center bg-overlayBackground bg-opacity-70">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirmClick();
        }}
        className="max-w-2xl w-full bg-white flex flex-col rounded-md space-y-4"
      >
        <div className="flex flex-row justify-between border-b p-4 border-panelBorder">
          <h1 className="text-lg font-bold">Headers</h1>
          <button type="button" onClick={onExitPress}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="px-4 py-2 flex flex-col space-y-2">
          {headers.map(([headerKey, headerValue], i) => (
            <div className="flex flex-col" key={i + ""}>
              <div className="flex flex-row items-start">
                <BaseTextField
                  className="flex-1"
                  label="Key"
                  value={headerKey}
                  onChange={(value) => update(i, value, "key")}
                />
                <span className="w-2 h-1" />
                <BaseTextField
                  label="Value"
                  className="flex-1"
                  value={headerValue}
                  onChange={(value) => update(i, value, "value")}
                />
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => deleteHeader(i)}
                >
                  <XIcon className="w-5 h-5 mt-[0.45rem] mr-2" />
                </button>
              </div>
              {errors[i] && (
                <FieldError errorMessage="Headers require a key and a value." />
              )}
            </div>
          ))}
          <AddItemButton onClick={addHeader} />
        </div>
        <div className="p-4 flex flex-row justify-between border-t border-t-panelBorder">
          <span className="flex flex-row items-center">
            Save Headers
            <input
              type="checkbox"
              className="ml-2"
              checked={saveHeadersToLocalStorage}
              onChange={(e) => setSaveHeadersToLocalStorage(e.target.checked)}
            />
          </span>
          <Button variant="query" formNoValidate onClick={onConfirmClick}>
            Confirm <SaveIcon className="ml-1" />
          </Button>
        </div>
      </form>
    </div>
  );
}
