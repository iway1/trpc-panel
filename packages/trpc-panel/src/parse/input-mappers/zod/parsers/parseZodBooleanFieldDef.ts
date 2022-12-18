import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodBooleanDef } from "zod";
import { BooleanNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodBooleanFieldDef: ParseFunction<
  ZodBooleanDef,
  BooleanNode
> = (def, refs) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "boolean", ...nodePropertiesFromRef(refs) };
};
