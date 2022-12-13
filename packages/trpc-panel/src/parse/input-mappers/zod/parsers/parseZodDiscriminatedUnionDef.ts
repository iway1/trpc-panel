import {
    ZodDiscriminatedUnionDef,
    ZodDiscriminatedUnionOption,
} from "zod";
import {
    DiscriminatedUnionNode,
    ParseFunction,
} from "../../../parsed-node-types";
import { zodSelectorFunction } from "../selector";

export const parseZodDiscriminatedUnionDef: ParseFunction<
    ZodDiscriminatedUnionDef<
        string,
        string,
        ZodDiscriminatedUnionOption<string, string>
    >,
    DiscriminatedUnionNode
> = (def, refs) => {
    const entries = Array.from(def.options.entries());
    const nodeEntries = entries.map(([discriminatorValue, zodObj]) => [
        discriminatorValue,
        zodSelectorFunction(zodObj._def, refs),
    ]);
    // Not sure why this is here but seems important
    // if (nodeEntries.some((e) => e[1] === null)) return null;

    const nodesMap = Object.fromEntries(nodeEntries);

    return {
        type: "discriminated-union",
        discriminatedUnionValues: entries.map(([n]) => n),
        discriminatedUnionChildrenMap: nodesMap,
        discriminatorName: def.discriminator,
        ...refs,
    };
};
