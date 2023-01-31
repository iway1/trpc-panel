import React, { useRef } from "react";
import { FieldError } from "@src/react-app/components/form/fields/FieldError";
import { useEnableInputGlobalHotkeys } from "@src/react-app/components/contexts/HotKeysContext";
import { useProcedureFormContext } from "@src/react-app/components/form/ProcedureForm/ProcedureFormContext";

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
  const { path: procedurePath } = useProcedureFormContext();
  const id = procedurePath + "." + fieldId;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="flex flex-row items-center">
        <input
          ref={inputRef}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2"
          type="checkbox"
          name={id}
          id={id}
        />
        {label}
      </label>
      {errorMessage && <FieldError errorMessage={errorMessage} />}
    </div>
  );
}
