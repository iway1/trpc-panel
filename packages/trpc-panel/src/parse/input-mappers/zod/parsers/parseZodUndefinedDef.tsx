import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodUndefinedDef } from "zod";

export function parseZodUndefinedDef(
    _def: ZodUndefinedDef,
    ref: ParseReferences
): ParsedInputNode {
    return {
        type: "literal",
        value: undefined,
        ...ref,
    };
}
