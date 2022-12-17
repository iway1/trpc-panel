import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodEnumDef } from "zod";
import { EnumNode, ParseFunction } from "../../../parsed-node-types";

export const parseZodEnumDef: ParseFunction<ZodEnumDef, EnumNode> = (
  def,
  refs
) => {
  const values = def.values as string[];
  return { type: "enum", enumValues: values, ...nodePropertiesFromRef(refs) };
};
