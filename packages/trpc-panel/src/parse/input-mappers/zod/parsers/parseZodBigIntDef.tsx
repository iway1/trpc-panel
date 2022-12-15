import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodBigIntDef } from "zod";

export function parseZodBigIntDef(
    _def: ZodBigIntDef,
    refs: ParseReferences
): ParsedInputNode {
    return {
        type: "number",
        ...refs,
    };
}
