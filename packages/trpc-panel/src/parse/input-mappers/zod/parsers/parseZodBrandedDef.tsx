import { zodSelectorFunction } from "src/parse/input-mappers/zod/selector";
import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { AnyZodObject, ZodBrandedDef } from "zod";

export function parseZodBrandedDef(
    def: ZodBrandedDef<AnyZodObject>,
    refs: ParseReferences
): ParsedInputNode {
    return zodSelectorFunction(def.type._def, refs);
}
