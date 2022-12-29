import React from "react";
import { Control, useController } from "react-hook-form";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { BaseSelectField } from "@src/react-app/components/form/fields/base/BaseSelectField";
import { ObjectField } from "@src/react-app/components/form/fields/ObjectField";
import { defaultFormValuesForNode } from "@src/react-app/components/form/utils";
import { InputGroupContainer } from "@src/react-app/components/InputGroupContainer";
import CirclesIcon from "@mui/icons-material/JoinRight";
import MoonIcon from "@mui/icons-material/Brightness2";
import { FieldError } from "@src/react-app/components/form/fields/FieldError";

export function DiscriminatedUnionField({
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
  // TODO figure out why this wasn't working in the props type
  const nodeTypecast = node as ParsedInputNode & {
    type: "discriminated-union";
  };
  const { field, fieldState } = useController({
    name,
    control,
  });
  function onDiscriminatorChange(value: string) {
    const newObj = nodeTypecast.discriminatedUnionChildrenMap[value]!;
    const newDefaultValues = {
      ...defaultFormValuesForNode(newObj),
      [nodeTypecast.discriminatorName]: value,
    };
    field.onChange(newDefaultValues);
  }
  const children = nodeTypecast.discriminatedUnionChildrenMap[
    field.value[nodeTypecast.discriminatorName]
  ]! as ParsedInputNode & { type: "object" };
  return (
    <InputGroupContainer
      title={label}
      iconElement={<CirclesIcon className="mr-1" />}
    >
      <BaseSelectField
        onChange={onDiscriminatorChange}
        value={field.value[nodeTypecast.discriminatorName]}
        label="Name"
        options={nodeTypecast.discriminatedUnionValues}
      />
      <ObjectField
        control={control}
        node={children}
        overrideIconElement={<MoonIcon className="mr-1" />}
        label={``}
      />
      {fieldState.error?.message && (
        <FieldError
          errorMessage={
            fieldState.error.message +
            ` (make sure to pass required properties)`
          }
        />
      )}
    </InputGroupContainer>
  );
}
