import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodStringDef } from "@src/parse/input-mappers/zod/parsers/parseZodStringDef";
import { StringNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodString", () => {
  it("should parse a string schema as a string node", () => {
    const expected: StringNode = {
      type: "string",
      path: [],
    };
    const schema = z.string();
    expect(parseZodStringDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
