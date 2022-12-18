import { defaultReferences } from "../../defaultReferences";
import { parseZodBigIntDef } from "../../zod/parsers/parseZodBigIntDef";
import { NumberNode } from "../../../parseNodeTypes";
import { z } from "zod";

describe("Zod BigInt", () => {
  it("should parse a big end as a number node", () => {
    const expected: NumberNode = {
      type: "number",
      path: [],
    };
    const schema = z.bigint();
    const parsed = parseZodBigIntDef(schema._def, defaultReferences());
    expect(parsed).toStrictEqual(expected);
  });
});
