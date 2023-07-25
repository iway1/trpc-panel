import React from "react";
import { Control, useController } from "react-hook-form";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { BaseSelectField } from "./base/BaseSelectField";

export function UnionField({
  name,
  label,
  control,
  node,
}: {
  name: string;
  label: string;
  control: Control<any>;
  node: ParsedInputNode & { type: "union" };
}) {
  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <BaseSelectField
      options={node.values.map((n) => n.value as string)}
      value={field.value}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
      label={label}
    />
  );
}
