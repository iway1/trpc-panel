import React, { InputHTMLAttributes, useRef } from "react";
import { default as MUITextField } from "@mui/material/TextField";
import { useEnableInputGlobalHotkeys } from "@src/react-app/components/contexts/HotKeysContext";

export function BaseTextField({
  value,
  onChange,
  errorMessage,
  label,
  inputProps,
  fieldId,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  label?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  >;
  fieldId?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEnableInputGlobalHotkeys(inputRef, []);
  return (
    <MUITextField
      inputRef={inputRef}
      variant="outlined"
      label={label}
      id={fieldId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        "border border-grey-700 rounded-sm p-2 flex flex-col" +
        (className ? ` ${className}` : "")
      }
      placeholder={label ? `Enter value for ${label}` : undefined}
      {...inputProps}
      color="primary"
      size="small"
      sx={{ input: { backgroundColor: "white" } }}
      error={!!errorMessage}
      helperText={errorMessage}
    />
    // {errorMessage && <FieldError errorMessage={errorMessage} />}
  );
}
