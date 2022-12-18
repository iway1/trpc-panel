import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodUndefinedDef } from "@src/parse/input-mappers/zod/parsers/parseZodUndefinedDef";
import { LiteralNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodUndefined", () => {
  it("should parse zod undefined as a literal with value undefined", () => {
    const unexpected: LiteralNode = {
      type: "literal",
      value: undefined,
      path: [],
    };
    const schema = z.undefined();
    expect(
      parseZodUndefinedDef(schema._def, defaultReferences())
    ).toStrictEqual(unexpected);
  });
});
