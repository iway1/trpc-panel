import { ParseFunction, StringNode } from "../../../parsed-node-types";
import { ZodStringDef } from "zod";

export const parseZodStringDef: ParseFunction<ZodStringDef, StringNode> = (_, refs)=>{
    return {
        type: 'string',
        path: refs.path,
        optional: refs.optional
    }
}