import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodNullDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullDef";
import { LiteralNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodNull", () => {
  it("should parse a zod nullable as a literal with value null", () => {
    const expected: LiteralNode = {
      type: "literal",
      value: null,
      path: [],
    };
    const schema = z.null();
    expect(parseZodNullDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
