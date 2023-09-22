import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodUnionDef } from "zod";
import { UnionNode, ParseFunction, LiteralNode } from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";

export const parseZodUnionDef: ParseFunction<ZodUnionDef, UnionNode> = (
  def,
  refs
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "union",
    values: def.options.map(
      (o) => zodSelectorFunction(o._def, { ...refs, path: [] }) as LiteralNode
    ),
    ...nodePropertiesFromRef(refs),
  };
};
