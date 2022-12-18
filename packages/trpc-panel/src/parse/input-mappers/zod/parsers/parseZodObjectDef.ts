import { nodePropertiesFromRef } from "@src/parse/utils";
import { ZodObjectDef } from "zod";
import {
  ObjectNode,
  ParsedInputNode,
  ParseFunction,
  UnsupportedNode,
} from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";

export const parseZodObjectDef: ParseFunction<
  ZodObjectDef,
  ObjectNode | UnsupportedNode
> = (def, refs) => {
  const shape = def.shape();
  const children: { [propertyName: string]: ParsedInputNode } = {};
  for (var propertyName of Object.keys(shape)) {
    const node = zodSelectorFunction(shape[propertyName]!._def, {
      ...refs,
      path: refs.path.concat([propertyName]),
    });
    children[propertyName] = node;
  }
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "object",
    children,
    ...nodePropertiesFromRef(refs),
  };
};
