import { ParsedInputNode, ParseReferences } from "@src/parse/parsed-node-types";
import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodBigIntDef } from "zod";

export function parseZodBigIntDef(
  _def: ZodBigIntDef,
  refs: ParseReferences
): ParsedInputNode {
  return {
    type: "number",
    ...nodePropertiesFromRef(refs),
  };
}
