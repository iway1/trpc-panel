import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodNumberDef } from "@src/parse/input-mappers/zod/parsers/parseZodNumberDef";
import { NumberNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodNumber", () => {
  it("should parse a number node", () => {
    const expected: NumberNode = {
      type: "number",
      path: [],
    };
    const schema = z.number();
    expect(parseZodNumberDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
