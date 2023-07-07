import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodNativeEnumDef } from "@src/parse/input-mappers/zod/parsers/parseZodNativeEnumDef";
import { EnumNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodNativeEnum", () => {
  it("should parse a zod native enum", () => {
    const expected: EnumNode = {
      type: "enum",
      enumValues: ["one", "two", "three"],
      path: [],
    };

    enum ExampleEnum {
      ONE = "one",
      TWO = "two",
      THREE = "three",
    };

    const parsed = parseZodNativeEnumDef(
      z.nativeEnum(ExampleEnum)._def,
      defaultReferences()
    );
    expect(expected).toStrictEqual(parsed);
  });
});
