import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodEnumDef } from "zod";
import { EnumNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodEnumDef: ParseFunction<ZodEnumDef, EnumNode> = (
  def,
  refs
) => {
  const values = def.values as string[];
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "enum", enumValues: values, ...nodePropertiesFromRef(refs) };
};
