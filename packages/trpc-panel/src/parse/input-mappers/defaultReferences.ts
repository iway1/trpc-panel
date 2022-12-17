import { ParseReferences } from "src/parse/parsed-node-types";

export function defaultReferences(): ParseReferences {
    return {
        path: [],
        options: {},
        optional: false,
    };
}
