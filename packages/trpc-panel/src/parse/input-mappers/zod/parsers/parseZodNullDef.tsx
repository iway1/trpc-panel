import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { nodePropertiesFromRef } from "src/parse/utils";
import { ZodNullDef } from "zod";

export function parseZodNullDef(
    _def: ZodNullDef,
    refs: ParseReferences
): ParsedInputNode {
    return {
        type: "literal",
        value: null,
        ...nodePropertiesFromRef(refs),
    };
}
