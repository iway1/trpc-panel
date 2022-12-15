import { zodSelectorFunction } from "src/parse/input-mappers/zod/selector";
import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodEffectsDef } from "zod";

export function parseZodEffectsDef(
    def: ZodEffectsDef,
    refs: ParseReferences
): ParsedInputNode {
    return zodSelectorFunction(def.schema._def, refs);
}
