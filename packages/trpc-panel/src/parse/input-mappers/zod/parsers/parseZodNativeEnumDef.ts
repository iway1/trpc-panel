import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodNativeEnumDef } from "zod";
import { EnumNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodNativeEnumDef: ParseFunction<ZodNativeEnumDef, EnumNode> = (
  def,
  refs
) => {
  const values = Object.values(def.values) as string[];
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "enum", enumValues: values, ...nodePropertiesFromRef(refs) };
};
