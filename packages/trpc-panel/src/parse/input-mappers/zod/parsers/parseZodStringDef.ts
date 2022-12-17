import { ParseFunction, StringNode } from "../../../parsed-node-types";
import { ZodStringDef } from "zod";
import { nodePropertiesFromRef } from "@src/parse/utils";

export const parseZodStringDef: ParseFunction<ZodStringDef, StringNode> = (
  _,
  refs
) => {
  return {
    type: "string",
    ...nodePropertiesFromRef(refs),
  };
};
