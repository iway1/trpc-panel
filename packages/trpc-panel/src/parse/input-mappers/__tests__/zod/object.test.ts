import { defaultReferences } from "@src/parse/input-mappers/defaultReferences";
import { parseZodObjectDef } from "@src/parse/input-mappers/zod/parsers/parseZodObjectDef";
import { ObjectNode } from "@src/parse/parseNodeTypes";
import { z } from "zod";

describe("Parse ZodObject", () => {
  it("should parse an empty zod object", () => {
    const expected: ObjectNode = {
      type: "object",
      children: {},
      path: [],
    };
    const schema = z.object({});
    expect(parseZodObjectDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
  it("should parse an object with different property types", () => {
    const expected: ObjectNode = {
      type: "object",
      children: {
        number: {
          type: "number",
          path: ["number"],
        },
        string: {
          type: "string",
          path: ["string"],
        },
      },
      path: [],
    };
    const schema = z.object({
      number: z.number(),
      string: z.string(),
    });
    expect(parseZodObjectDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
  it("should correctly create nested object paths", () => {
    const expected: ObjectNode = {
      type: "object",
      path: [],
      children: {
        obj: {
          type: "object",
          path: ["obj"],
          children: {
            obj2: {
              type: "object",
              path: ["obj", "obj2"],
              children: {
                str: {
                  type: "string",
                  path: ["obj", "obj2", "str"],
                },
              },
            },
          },
        },
      },
    };
    const schema = z.object({
      obj: z.object({
        obj2: z.object({
          str: z.string(),
        }),
      }),
    });
    expect(parseZodObjectDef(schema._def, defaultReferences())).toStrictEqual(
      expected
    );
  });
});
