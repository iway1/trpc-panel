import { ParsedInputNode, ParseReferences } from "@src/parse/parseNodeTypes";
import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodUndefinedDef } from "zod";

export function parseZodUndefinedDef(
  def: ZodUndefinedDef,
  refs: ParseReferences
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: undefined,
    ...nodePropertiesFromRef(refs),
  };
}
