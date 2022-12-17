import {
    ParseReferences,
    SharedInputNodeProperties,
} from "src/parse/parsed-node-types";

export function nodePropertiesFromRef(
    references: ParseReferences
): SharedInputNodeProperties {
    return {
        path: references.path,
        ...(references.optional && { optional: true }),
    };
}
