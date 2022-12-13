import { ZodBooleanDef } from "zod";
import { BooleanNode, ParseFunction } from "../../../parsed-node-types";

export const parseZodBooleanFieldDef: ParseFunction<ZodBooleanDef, BooleanNode> = (_, ref)=>{
    return { type: "boolean", ...ref };
}