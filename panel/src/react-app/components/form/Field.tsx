import React from "react";
import { Control } from "react-hook-form";
import { ParsedInputNode } from "src/parse/parse-router";
import { ArrayField } from "src/react-app/components/form/fields/ArrayField";
import { BooleanField } from "src/react-app/components/form/fields/BooleanField";
import { DiscriminatedUnionField } from "src/react-app/components/form/fields/DiscriminatedUnionField";
import { EnumField } from "src/react-app/components/form/fields/EnumField";
import { LiteralField } from "src/react-app/components/form/fields/LiteralField";
import { NumberField } from "src/react-app/components/form/fields/NumberField";
import { ObjectField } from "src/react-app/components/form/fields/ObjectField";
import { TextField } from "src/react-app/components/form/fields/TextField";

export function Field({
    inputNode,
    control,
}: {
    inputNode: ParsedInputNode;
    control: Control;
}) {
    const path = inputNode.path.join(".");
    switch (inputNode.type) {
        case "string":
            return <TextField name={path} control={control} node={inputNode} />;
        case "number":
            return (
                <NumberField name={path} control={control} node={inputNode} />
            );
        case "object":
            return (
                <ObjectField name={path} control={control} node={inputNode} />
            );
        case "boolean":
            return (
                <BooleanField name={path} control={control} node={inputNode} />
            );
        case "enum":
            return (
                <EnumField
                    name={path}
                    control={control}
                    options={inputNode.enumValues}
                />
            );
        case "array":
            return (
                <ArrayField name={path} control={control} node={inputNode} />
            );
        case "discriminated-union":
            return (
                <DiscriminatedUnionField
                    name={path}
                    control={control}
                    node={inputNode}
                />
            );
        case "literal":
            return <LiteralField />;
    }
}
