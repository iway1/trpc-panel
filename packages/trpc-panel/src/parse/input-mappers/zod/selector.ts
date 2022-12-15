import { ParsedInputNode } from "../../parsed-node-types";
import {
    z,
    ZodArrayDef,
    ZodBooleanDef,
    ZodEnumDef,
    ZodFirstPartyTypeKind,
    ZodLiteralDef,
    ZodNullableDef,
    ZodNumberDef,
    ZodObjectDef,
    ZodOptionalDef,
    ZodStringDef,
} from "zod";
import { parseZodStringDef } from "./parsers/parseZodStringDef";
import { ParserSelectorFunction } from "../../parsed-node-types";
import { ZodDefWithType } from "./zod-types";
import { parseZodArrayDef } from "./parsers/parseZodArrayDef";
import { parseZodBooleanFieldDef } from "./parsers/parseZodBooleanFieldDef";
import {
    parseZodDiscriminatedUnionDef,
    ZodDiscriminatedUnionDefUnversioned,
} from "./parsers/parseZodDiscriminatedUnionDef";
import { parseZodEnumDef } from "./parsers/parseZodEnumDef";
import { parseZodLiteralDef } from "./parsers/parseZodLiteralDef";
import { parseZodNumberDef } from "./parsers/parseZodNumberDef";
import { parseZodObjectDef } from "./parsers/parseZodObjectDef";
import { parseZodOptionalDef } from "src/parse/input-mappers/zod/parsers/parseZodOptionalDef";
import { parseZodNullableDef } from "src/parse/input-mappers/zod/parsers/parseZodNullableDef";

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
                // Zod had some type changes between 3.19 -> 3.20 and we want to support both, not sure there's a way
                // to avoid this.
                def as unknown as ZodDiscriminatedUnionDefUnversioned,
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
            return parseZodOptionalDef(def as ZodOptionalDef, references);
        case ZodFirstPartyTypeKind.ZodString:
            return parseZodStringDef(def as ZodStringDef, references);
        case ZodFirstPartyTypeKind.ZodNullable:
            return parseZodNullableDef(def as ZodNullableDef, references);
    }
    return { type: "unsupported", path: references.path, optional: false };
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
