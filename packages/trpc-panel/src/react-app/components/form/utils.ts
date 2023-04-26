import type { ParsedInputNode } from "@src/parse/parseNodeTypes";

// TODO - Use an actual type instead of any? Not sure if it's really worth it or not.
export function defaultFormValuesForNode(node: ParsedInputNode): any {
  switch (node.type) {
    case "array":
      return [];
    case "boolean":
      return;
    case "discriminated-union":
      const firstValue = node.discriminatedUnionValues[0]!;
      return defaultFormValuesForNode(
        node.discriminatedUnionChildrenMap[firstValue]!
      );
    case "enum":
      return;
    // return node.enumValues[0];
    case "object":
      const obj: any = {};
      for (var [name, node] of Object.entries(node.children)) {
        obj[name] = defaultFormValuesForNode(node);
      }
      return obj;
    case "literal":
      return node.value;
    case "string":
    case "number":
      // Seems it's more natural for these to have no value
      // as a default
      return;
  }
}
