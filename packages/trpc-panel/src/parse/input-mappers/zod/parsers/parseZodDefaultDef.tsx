import { zodSelectorFunction } from "src/parse/input-mappers/zod/selector";
import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodDefaultDef } from "zod";

export function parseZodDefaultDef(
    def: ZodDefaultDef,
    refs: ParseReferences
): ParsedInputNode {
    return zodSelectorFunction(def.innerType._def, refs);
}
