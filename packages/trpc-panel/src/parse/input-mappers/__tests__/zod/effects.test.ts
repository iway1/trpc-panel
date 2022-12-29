import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodEffectsDef } from "@src/parse/input-mappers/zod/parsers/parseZodEffectsDef";
import { StringNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodEffects", () => {
  it("should parse a zod effects string as an string", () => {
    const expected: StringNode = {
      type: "string",
      path: [],
    };
    const schema = z.preprocess((val) => String(val), z.string());
    expect(parseZodEffectsDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
