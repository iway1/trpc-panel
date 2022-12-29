import { Control, useController } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { BaseTextField } from "./base/BaseTextField";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";

export function NumberField({
  name,
  control,
  label,
  node: inputNode,
}: {
  name: string;
  label: string;
  control: Control<any>;
  node: ParsedInputNode;
}) {
  const [stringValue, setStringValue] = useState("");

  const { field, fieldState } = useController({
    control,
    name,
  });

  function onChange(value: string) {
    if (value == "") {
      setStringValue("");
      return;
    }
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return;
    setStringValue(numberValue + (value[value.length - 1] == "." ? "." : ""));
  }

  useEffect(() => {
    // Not sure how else to do this while still allowing users to input a decimal point
    field.onChange(parseFloat(stringValue));
  }, [stringValue]);

  // ¯\_(ツ)_/¯
  useEffect(() => {
    if (!field.value) setStringValue("");
  }, [field.value]);

  return (
    <BaseTextField
      onChange={onChange}
      value={stringValue}
      errorMessage={fieldState.error?.message}
      label={label}
      fieldId={inputNode.path.join(".")}
      inputProps={{ inputMode: "decimal" }}
    />
  );
}
