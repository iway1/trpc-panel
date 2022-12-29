import { defaultReferences } from "../../defaultReferences";
import { ParsedInputNode } from "../../../parseNodeTypes";
import { z, ZodBrandedDef, ZodType } from "zod";
import { parseZodBrandedDef } from "../../zod/parsers/parseZodBrandedDef";

describe("Parsed ZodBranded", () => {
  it("should parse branded nodes as their base zod type", () => {
    const testCases: {
      node: ParsedInputNode;
      zodType: ZodType;
    }[] = [
      {
        node: {
          type: "number",
          path: [],
        },
        zodType: z.number().brand("number"),
      },
      {
        node: {
          type: "string",
          path: [],
        },
        zodType: z.string().brand("string"),
      },
    ];
    for (var testCase of testCases) {
      const parsed = parseZodBrandedDef(
        testCase.zodType._def as unknown as ZodBrandedDef<any>,
        defaultReferences()
      );
      expect(parsed).toStrictEqual(testCase.node);
    }
  });
});
