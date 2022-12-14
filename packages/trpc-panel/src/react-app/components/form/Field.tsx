import React from "react";
import { Control } from "react-hook-form";
import { ParsedInputNode } from "../../../parse/parsed-node-types";
import { ArrayField } from "./fields/ArrayField";
import { BooleanField } from "./fields/BooleanField";
import { DiscriminatedUnionField } from "./fields/DiscriminatedUnionField";
import { EnumField } from "./fields/EnumField";
import { LiteralField } from "./fields/LiteralField";
import { NumberField } from "./fields/NumberField";
import { ObjectField } from "./fields/ObjectField";
import { TextField } from "./fields/TextField";

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
        case "unsupported":
            return null;
    }
}
