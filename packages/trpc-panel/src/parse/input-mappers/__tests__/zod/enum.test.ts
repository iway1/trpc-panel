import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodEnumDef } from "@src/parse/input-mappers/zod/parsers/parseZodEnumDef";
import { EnumNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodEnum", () => {
  it("should parse a zod enum", () => {
    const expected: EnumNode = {
      type: "enum",
      enumValues: ["one", "two", "three"],
      path: [],
    };
    const parsed = parseZodEnumDef(
      z.enum(["one", "two", "three"])._def,
      defaultReferences()
    );
    expect(expected).toStrictEqual(parsed);
  });
});
