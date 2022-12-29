import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodNullableDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullableDef";
import { NumberNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodNullable", () => {
  it("should parse a nullable as it's underlying type", () => {
    const expected: NumberNode = {
      type: "number",
      path: [],
    };
    const schema = z.number().nullable();
    expect(parseZodNullableDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
