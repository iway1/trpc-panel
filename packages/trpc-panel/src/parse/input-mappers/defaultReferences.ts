import { ParseReferences } from "@src/parse/parseNodeTypes";

export function defaultReferences(): ParseReferences {
  return {
    path: [],
    options: {},
    addDataFunctions: {
      addDescriptionIfExists: () => {},
    }
  };
}
