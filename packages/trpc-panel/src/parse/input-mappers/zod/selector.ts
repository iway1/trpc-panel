import { ParsedInputNode } from "../../parsed-node-types";
import {
    z,
    ZodArrayDef,
    ZodBooleanDef,
    ZodDiscriminatedUnionDef,
    ZodEnumDef,
    ZodFirstPartyTypeKind,
    ZodLiteralDef,
    ZodNumberDef,
    ZodObjectDef,
    ZodStringDef,
} from "zod";
import { parseZodStringDef } from "./parsers/parseZodStringDef";
import { ParserSelectorFunction } from "../../parsed-node-types";
import { ZodDefWithType } from "./zod-types";
import { parseZodArrayDef } from "./parsers/parseZodArrayDef";
import { parseZodBooleanFieldDef } from "./parsers/parseZodBooleanFieldDef";
import { parseZodDiscriminatedUnionDef } from "./parsers/parseZodDiscriminatedUnionDef";
import { parseZodEnumDef } from "./parsers/parseZodEnumDef";
import { parseZodLiteralDef } from "./parsers/parseZodLiteralDef";
import { parseZodNumberDef } from "./parsers/parseZodNumberDef";
import { parseZodObjectDef } from "./parsers/parseZodObjectDef";

export const zodSelectorFunction: ParserSelectorFunction<ZodDefWithType> = (
    def,
    references
) => {
    // const optional = isZodOptional(zodAny);
    // const unwrappedOptional = optional ? zodAny._def.innerType : zodAny;
    // Please keep these in alphabetical order
    switch (def.typeName) {
        case ZodFirstPartyTypeKind.ZodArray:
            return parseZodArrayDef(def as ZodArrayDef, references);
        case ZodFirstPartyTypeKind.ZodBoolean:
            return parseZodBooleanFieldDef(def as ZodBooleanDef, references);
        case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return parseZodDiscriminatedUnionDef(
                def as ZodDiscriminatedUnionDef<any, any, any>,
                references
            );
        case ZodFirstPartyTypeKind.ZodEnum:
            return parseZodEnumDef(def as ZodEnumDef, references);
        case ZodFirstPartyTypeKind.ZodLiteral:
            return parseZodLiteralDef(def as ZodLiteralDef, references);
        case ZodFirstPartyTypeKind.ZodNumber:
            return parseZodNumberDef(def as ZodNumberDef, references);
        case ZodFirstPartyTypeKind.ZodObject:
            return parseZodObjectDef(def as ZodObjectDef, references);
        case ZodFirstPartyTypeKind.ZodOptional:
            return parseZodObjectDef(def as ZodObjectDef, references);
        case ZodFirstPartyTypeKind.ZodString:
            return parseZodStringDef(def as ZodStringDef, references);
    }

    return { type: "unsupported", path: references.path };
};

export function mapZodObjectToNode(
    object: z.AnyZodObject
): ParsedInputNode | null {
    const parsed = zodSelectorFunction(object._def, {
        path: [],
        optional: false,
        options: {},
    });
    return parsed;
}
