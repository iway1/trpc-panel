import { zodSelectorFunction } from "src/parse/input-mappers/zod/selector";
import { ParsedInputNode, ParseReferences } from "src/parse/parsed-node-types";
import { ZodPromiseDef } from "zod";

export function parseZodPromiseDef(
    def: ZodPromiseDef,
    refs: ParseReferences
): ParsedInputNode {
    return zodSelectorFunction(def.type._def, refs);
}
