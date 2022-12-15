import { NumberNode, ParseFunction } from "../../../parsed-node-types";
import { ZodNumberDef } from "zod";

export const parseZodNumberDef: ParseFunction<ZodNumberDef, NumberNode> = (
    _,
    references
) => {
    return {
        type: "number",
        path: references.path,
    };
};
