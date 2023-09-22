import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodUnionDef } from "@src/parse/input-mappers/zod/parsers/parseZodUnionDef";
import { UnionNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse Zod Union", () => {
  it("should parse a union node", () => {
    const expected: UnionNode = {
      type: "union",
      path: [],
      values: [
        {
          type: "literal",
          value: "one",
          path: [],
        },
        {
          type: "literal",
          value: 2,
          path: [],
        },
      ],
    };
    const zodSchema = z.union([z.literal("one"), z.literal(2)]);
    const parsedZod = parseZodUnionDef(zodSchema._def, defaultReferences());
    expect(parsedZod).toStrictEqual(expected);
  });
});
