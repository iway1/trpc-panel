import React, { ReactNode } from "react";
import { Control } from "react-hook-form";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { Field } from "@src/react-app/components/form/Field";
import ObjectIcon from "@mui/icons-material/DataObjectOutlined";
import { InputGroupContainer } from "../../InputGroupContainer";

export function ObjectField({
  label,
  control,
  node,
  topLevel,
  overrideIconElement,
}: {
  label: string;
  control: Control<any>;
  node: ParsedInputNode & { type: "object" };
  topLevel?: boolean;
  overrideIconElement?: ReactNode;
}) {
  if (topLevel) {
    return (
      <div className={"space-y-2 flex-col flex p-1 "}>
        {Object.entries(node.children).map(([name, e]) => (
          <Field
            inputNode={{
              ...e,
              path: node.path.concat([name]),
            }}
            control={control}
            key={name}
          />
        ))}
      </div>
    );
  }
  return (
    <InputGroupContainer
      title={label}
      iconElement={overrideIconElement ?? <ObjectIcon className="mr-1" />}
    >
      {Object.entries(node.children).map(([childFieldName, e]) => (
        <Field
          inputNode={{
            ...e,
            path: node.path.concat([childFieldName]),
          }}
          control={control}
          key={childFieldName}
        />
      ))}
    </InputGroupContainer>
  );
}
