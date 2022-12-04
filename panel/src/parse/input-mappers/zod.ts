import { ParsedInputNode } from "../parse-router";
import { z } from "zod";
// TODO - Use zods enum instead?
enum ZodTypeNames {
    string = "ZodString",
    number = "ZodNumber",
    boolean = "ZodBoolean",
    object = "ZodObject",
    enum = "ZodEnum",
    array = "ZodArray",
    descriminatedUnion = "ZodDiscriminatedUnion",
    optional = "ZodOptional",
    literal = "ZodLiteral",
    void = "ZodVoid",
}

function checkZodType(typeName: string, zodObject: z.AnyZodObject) {
    return zodObject._def.typeName === typeName;
}

function isZodOptional(
    zodObject: z.AnyZodObject | z.ZodOptional<any>
): zodObject is z.ZodOptional<any> {
    return (
        zodObject._def.typeName ===
        (ZodTypeNames.optional as unknown as z.ZodFirstPartyTypeKind)
    );
}

function mapNode(
    path: string[],
    zodAny: z.AnyZodObject | z.ZodOptional<any>
): ParsedInputNode | null {
    const optional = isZodOptional(zodAny);
    const unwrappedOptional = optional ? zodAny._def.innerType : zodAny;
    if (checkZodType(ZodTypeNames.string, unwrappedOptional)) {
        return { type: "string", path, optional };
    }
    if (checkZodType(ZodTypeNames.number, unwrappedOptional)) {
        return { type: "number", path, optional };
    }
    if (checkZodType(ZodTypeNames.boolean, unwrappedOptional)) {
        return { type: "boolean", path, optional };
    }
    if (checkZodType(ZodTypeNames.descriminatedUnion, unwrappedOptional)) {
        const union = unwrappedOptional as unknown as z.ZodDiscriminatedUnion<
            string,
            string,
            any
        >;
        const entries = Array.from(union._def.options.entries());
        const nodeEntries = entries.map(([discriminatorValue, zodObj]) => [
            discriminatorValue,
            mapNode(path, zodObj),
        ]);
        if (nodeEntries.some((e) => e[1] === null)) return null;
        const nodesMap = Object.fromEntries(nodeEntries);

        return {
            type: "discriminated-union",
            path,
            optional,
            discriminatedUnionValues: entries.map(([n]) => n),
            discriminatedUnionChildrenMap: nodesMap,
            discriminatorName: union._def.discriminator,
        };
    }
    if (checkZodType(ZodTypeNames.enum, unwrappedOptional)) {
        const enum_ = unwrappedOptional as z.ZodEnum<any>;
        const values = enum_._def.values as string[];
        return { type: "enum", path, optional, enumValues: values };
    }
    if (checkZodType(ZodTypeNames.object, unwrappedOptional)) {
        const obj = unwrappedOptional as z.ZodObject<any>;
        const shape = obj.shape;
        const children: { [propertyName: string]: ParsedInputNode } = {};
        for (var propertyName of Object.keys(shape)) {
            const node = mapNode(
                path.concat([propertyName]),
                shape[propertyName]!
            );
            if (node === null) return null;
            children[propertyName] = node;
        }
        return {
            type: "object",
            children,
            path,
            optional,
        };
    }
    if (checkZodType(ZodTypeNames.array, unwrappedOptional)) {
        const { type } = (unwrappedOptional as z.ZodArray<any>)._def;
        // Pass empty path because it will be calculated dynamically on the front end
        // (dynamic path gets passed to components)
        const childType = mapNode([], type);
        if (childType === null) return null;
        return {
            type: "array",

            childType,
            path,
            optional,
        };
    }
    if (checkZodType(ZodTypeNames.literal, unwrappedOptional)) {
        const { value } = unwrappedOptional as z.ZodLiteral<
            bigint | string | number | boolean
        >;
        return {
            value,
            type: "literal",
            path,
            optional,
        };
    }
    return null;
}

export function mapZodObjectToNode(
    object: z.AnyZodObject
): ParsedInputNode | null {
    const parsed = mapNode([], object);
    return parsed;
}
