import { ROOT_VALS_PROPERTY_NAME } from "@src/react-app/components/form/ProcedureForm";
import React from "react";
import { Control } from "react-hook-form";
import { ParsedInputNode } from "../../../parse/parseNodeTypes";
import { ArrayField } from "./fields/ArrayField";
import { BooleanField } from "./fields/BooleanField";
import { DiscriminatedUnionField } from "./fields/DiscriminatedUnionField";
import { EnumField } from "./fields/EnumField";
import { LiteralField } from "./fields/LiteralField";
import { NumberField } from "./fields/NumberField";
import { ObjectField } from "./fields/ObjectField";
import { TextField } from "./fields/TextField";
import { UnionField } from "./fields/UnionField";

export function Field({
  inputNode,
  control,
}: {
  inputNode: ParsedInputNode;
  control: Control<any>;
}) {
  const label = inputNode.path.join(".");
  const path = `${ROOT_VALS_PROPERTY_NAME}.${label}`;
  switch (inputNode.type) {
    case "string":
      return (
        <TextField
          name={path}
          control={control}
          node={inputNode}
          label={label}
        />
      );
    case "number":
      return (
        <NumberField
          name={path}
          label={label}
          control={control}
          node={inputNode}
        />
      );
    case "object":
      return <ObjectField label={label} control={control} node={inputNode} />;
    case "boolean":
      return (
        <BooleanField
          name={path}
          label={label}
          control={control}
          node={inputNode}
        />
      );
    case "enum":
      return (
        <EnumField
          name={path}
          label={label}
          control={control}
          options={inputNode.enumValues}
        />
      );
    case "array":
      return (
        <ArrayField
          name={path}
          label={label}
          control={control}
          node={inputNode}
        />
      );
    case "discriminated-union":
      return (
        <DiscriminatedUnionField
          name={path}
          label={label}
          control={control}
          node={inputNode}
        />
      );
    case "union":
      return (
        <UnionField
          name={path}
          label={label}
          control={control}
          node={inputNode}
        />
      );
    case "literal":
      return <LiteralField />;
    case "unsupported":
      return null;
  }
}
