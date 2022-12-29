import React from "react";
import { Control, useController } from "react-hook-form";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { BaseCheckboxField } from "@src/react-app/components/form/fields/base/BaseCheckboxField";

export function BooleanField({
  name,
  label,
  control,
  node,
}: {
  name: string;
  label: string;
  control: Control<any>;
  node: ParsedInputNode;
}) {
  const { field, fieldState } = useController({ name, control });
  const path = node.path.join(".");
  return (
    <BaseCheckboxField
      fieldId={path}
      label={label}
      onChange={field.onChange}
      value={field.value}
      errorMessage={fieldState.error?.message}
    />
  );
}
