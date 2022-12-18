import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodLiteralDef } from "zod";
import { LiteralNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodLiteralDef: ParseFunction<ZodLiteralDef, LiteralNode> = (
  def,
  refs
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: def.value,
    ...nodePropertiesFromRef(refs),
  };
};
