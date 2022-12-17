import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { nodePropertiesFromRef } from "src/parse/utils";
import { ZodUndefinedDef } from "zod";

export function parseZodUndefinedDef(
    _def: ZodUndefinedDef,
    ref: ParseReferences
): ParsedInputNode {
    return {
        type: "literal",
        value: undefined,
        ...nodePropertiesFromRef(ref),
    };
}
