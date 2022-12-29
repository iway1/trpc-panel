import { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { z, ZodSchema } from "zod";

export const testEnumValues = ["a", "b", "c"] as const;
export const testSchemas: {schema: ZodSchema, parsed: ParsedInputNode}[] = [
  {schema: z.string(), parsed: {type: "string", path: ['0']}},
  {schema: z.number(), parsed: {type: "number", path: ['1']}},
  {schema: z.boolean(), parsed: {type: "boolean", path: ['2']}},
  {schema: z.undefined(), parsed: {type: "literal", value: undefined, path: ['3']}},
  {schema: z.null(), parsed: {type: "literal", value: null, path: ['4']}},
  {schema: z.bigint(), parsed: {type: "number", path: ['5']}},
  {schema: z.enum(testEnumValues), parsed: {type: "enum", enumValues: testEnumValues as unknown as string[], path: ['6']}},
  {schema: z.string().array(), parsed: {type: "array", path: ['7'], childType: {type: "string", path: []}}},
  {schema: z.string().optional(), parsed: {type: 'string', path: ['8'], optional: true}}
]