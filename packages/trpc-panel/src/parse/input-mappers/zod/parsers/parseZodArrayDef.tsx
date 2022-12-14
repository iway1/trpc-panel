import { ZodArrayDef } from "zod";
import { ArrayNode, ParseFunction } from "../../../parsed-node-types";
import { zodSelectorFunction } from "../selector";

export const parseZodArrayDef: ParseFunction<ZodArrayDef, ArrayNode> = (def, refs) => {
    const {type} = def
    const childType = zodSelectorFunction(type._def, refs)
    return {
        type: "array",
        childType,
        ...refs
    };
}