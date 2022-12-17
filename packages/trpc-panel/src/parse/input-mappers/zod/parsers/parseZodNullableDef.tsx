import { zodSelectorFunction } from "@src/parse/input-mappers/zod/selector";
import { ParsedInputNode, ParseReferences } from "@src/parse/parsed-node-types";
import { ZodNullableDef } from "zod";

export function parseZodNullableDef(
  def: ZodNullableDef,
  refs: ParseReferences
): ParsedInputNode {
  return zodSelectorFunction(def.innerType._def, refs);
}
