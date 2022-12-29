import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodOptionalDef } from "@src/parse/input-mappers/zod/parsers/parseZodOptionalDef";
import { NumberNode, ObjectNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodOptional", () => {
  it("should return it's parsed inner type with optional true", () => {
    const expected: NumberNode = {
      type: "number",
      optional: true,
      path: [],
    };
    const schema = z.number().optional();
    expect(parseZodOptionalDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
  it("should not apply optional: true to nodes that are not direct children", () => {
    const expected: ObjectNode = {
      optional: true,
      type: "object",
      path: [],
      children: {
        number: {
          type: "number",
          path: ["number"],
        },
      },
    };
    const schema = z
      .object({
        number: z.number(),
      })
      .optional();
    expect(parseZodOptionalDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
