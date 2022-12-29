import {
  ParseReferences,
  SharedInputNodeProperties,
} from "@src/parse/parseNodeTypes";

export function nodePropertiesFromRef(
  references: ParseReferences
): SharedInputNodeProperties {
  return {
    path: references.path,
    ...(references.optional && { optional: true }),
  };
}
