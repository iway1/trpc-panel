import { defaultReferences } from "../../defaultReferences";
import { parseZodVoidDef } from "../../zod/parsers/parseZodVoidDef";
import { zodSelectorFunction } from "../../zod/selector";
import { LiteralNode } from "../../../parseNodeTypes";
import { z } from "zod";

describe("Parse ZodVoid", () => {
  it("should parse a void def as a literal node with undefined value", () => {
    const expected: LiteralNode = {
      type: "literal",
      path: [],
      value: undefined,
    };
    const zodSchema = z.void();
    const parsed = parseZodVoidDef(zodSchema._def, defaultReferences());
    expect(parsed).toStrictEqual(expected);
  });

  it("should be mapped correctly via the selector and parsed as a literal node", () => {
    const expected: LiteralNode = {
      type: "literal",
      path: [],
      value: undefined,
    };
    const zodSchema = z.void();
    const parsed = zodSelectorFunction(zodSchema._def, defaultReferences());
    expect(parsed).toStrictEqual(expected);
  });
});
