import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import {
  parseZodDiscriminatedUnionDef,
  ZodDiscriminatedUnionDefUnversioned,
} from "@src/parse/input-mappers/zod/parsers/parseZodDiscriminatedUnionDef";
import { DiscriminatedUnionNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse Zod Discriminated Union", () => {
  //write test
  it("should parse a discriminated union node", () => {
    const expected: DiscriminatedUnionNode = {
      type: "discriminated-union",
      path: [],
      discriminatorName: "disc",
      discriminatedUnionValues: ["one", "two"],
      discriminatedUnionChildrenMap: {
        one: {
          type: "object",
          children: {
            numberPropertyOne: {
              type: "number",
              path: ["numberPropertyOne"],
            },
            disc: {
              type: "literal",
              path: ["disc"],
              value: "one",
            },
          },
          path: [],
        },
        two: {
          type: "object",
          children: {
            stringPropertyTwo: {
              type: "string",
              path: ["stringPropertyTwo"],
            },
            disc: {
              type: "literal",
              path: ["disc"],
              value: "two",
            },
          },
          path: [],
        },
      },
    };
    const zodSchema = z.discriminatedUnion("disc", [
      z.object({
        disc: z.literal("one"),
        numberPropertyOne: z.number(),
      }),
      z.object({
        disc: z.literal("two"),
        stringPropertyTwo: z.string(),
      }),
    ]);
    const parsedZod = parseZodDiscriminatedUnionDef(
      zodSchema._def as unknown as ZodDiscriminatedUnionDefUnversioned,
      defaultReferences()
    );
    expect(parsedZod).toStrictEqual(expected);
  });
});
