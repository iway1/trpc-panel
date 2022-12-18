import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodPromiseDef } from "@src/parse/input-mappers/zod/parsers/parseZodPromiseDef";
import { NumberNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodPromise", () => {
  it("should parse a zod promise as it's underlying node type", () => {
    const expected: NumberNode = {
      type: "number",
      path: [],
    };
    const schema = z.number().promise();
    expect(parseZodPromiseDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
