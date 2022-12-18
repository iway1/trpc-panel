import { ParseFunction, StringNode } from "../../../parseNodeTypes";
import { ZodStringDef } from "zod";
import { nodePropertiesFromRef } from "@src/parse/utils";

export const parseZodStringDef: ParseFunction<ZodStringDef, StringNode> = (
  def,
  refs
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "string",
    ...nodePropertiesFromRef(refs),
  };
};
