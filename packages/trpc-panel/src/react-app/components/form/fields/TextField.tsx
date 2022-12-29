import { Control, useController } from "react-hook-form";
import React from "react";
import { BaseTextField } from "./base/BaseTextField";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";

export function TextField({
  name,
  label,
  control,
  node: inputNode,
}: {
  name: string;
  label: string;
  control: Control;
  node: ParsedInputNode;
}) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <BaseTextField
      value={field.value ? field.value : ""}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
      label={`${label}${inputNode.optional ? "" : "*"}`}
      fieldId={inputNode.path.join(".")}
    />
  );
}
