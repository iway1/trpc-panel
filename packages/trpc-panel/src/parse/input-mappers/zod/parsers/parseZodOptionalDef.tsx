import { ZodOptionalDef } from "zod";
import { ParsedInputNode, ParseFunction } from "../../../parsed-node-types";
import { zodSelectorFunction } from "../selector";

export const parseZodOptionalDef: ParseFunction<
  ZodOptionalDef,
  ParsedInputNode
> = (def, refs) => {
  const parsedInner = zodSelectorFunction(def.innerType._def, refs);
  return {
    ...parsedInner,

    optional: true,
  };
};
