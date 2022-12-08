import React, { ReactNode } from "react";
import { Control } from "react-hook-form";
import { ParsedInputNode } from "src/parse/parse-router";
import { Field } from "src/react-app/components/form/Field";
import ObjectIcon from "@mui/icons-material/DataObjectOutlined";
import { InputGroupContainer } from "../../InputGroupContainer";

export function ObjectField({
    name,
    control,
    node,
    topLevel,
    overrideIconElement,
}: {
    name: string;
    control: Control<any>;
    node: ParsedInputNode & { type: "object" };
    topLevel?: boolean;
    overrideIconElement?: ReactNode;
}) {
    if (topLevel) {
        return (
            <div className={"space-y-2 flex-col flex p-1 "}>
                {Object.entries(node.children).map(([name, e]) => (
                    <Field inputNode={e} control={control} key={name} />
                ))}
            </div>
        );
    }

    return (
        <InputGroupContainer
            title={name}
            iconElement={overrideIconElement ?? <ObjectIcon className="mr-1" />}
        >
            {Object.entries(node.children).map(([childFieldName, e]) => (
                <Field inputNode={e} control={control} key={childFieldName} />
            ))}
        </InputGroupContainer>
    );
}
