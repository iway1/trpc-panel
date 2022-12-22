import { LiteralNode, ParseReferences } from "@src/parse/parseNodeTypes";
import { ZodVoidDef } from "zod";

export function parseZodVoidDef(
  _: ZodVoidDef,
  refs: ParseReferences
): LiteralNode {
  return {
    type: "literal",
    value: undefined,
    path: refs.path,
  };
}
