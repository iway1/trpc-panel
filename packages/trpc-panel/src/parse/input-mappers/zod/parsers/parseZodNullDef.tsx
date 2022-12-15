import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodNullDef } from "zod";

export function parseZodNullDef(
    _def: ZodNullDef,
    refs: ParseReferences
): ParsedInputNode {
    return {
        type: "literal",
        value: null,
        ...refs,
    };
}
