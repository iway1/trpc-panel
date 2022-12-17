import { NumberNode, ParseFunction } from "../../../parsed-node-types";
import { ZodNumberDef } from "zod";
import { nodePropertiesFromRef } from "src/parse/utils";

export const parseZodNumberDef: ParseFunction<ZodNumberDef, NumberNode> = (
    _,
    references
) => {
    return {
        type: "number",
        ...nodePropertiesFromRef(references),
    };
};
