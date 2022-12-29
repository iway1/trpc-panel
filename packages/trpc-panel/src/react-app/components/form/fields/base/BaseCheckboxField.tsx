import React, { useRef } from "react";
import { FieldError } from "@src/react-app/components/form/fields/FieldError";
import { useEnableInputGlobalHotkeys } from "@src/react-app/components/contexts/HotKeysContext";

export function BaseCheckboxField({
  value,
  onChange,
  errorMessage,
  label,
  fieldId,
}: {
  value?: boolean;
  onChange: (value: boolean) => void;
  errorMessage?: string;
  label: string;
  fieldId: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEnableInputGlobalHotkeys(inputRef, []);
  return (
    <div className="flex flex-col">
      <label htmlFor={fieldId} className="flex flex-row items-center">
        <input
          ref={inputRef}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2"
          type="checkbox"
          name={fieldId}
          id={fieldId}
        />
        {label}
      </label>
      {errorMessage && <FieldError errorMessage={errorMessage} />}
    </div>
  );
}
