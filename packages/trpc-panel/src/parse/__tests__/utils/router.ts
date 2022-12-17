import { initTRPC } from "@trpc/server";
import { ObjectNode } from "@src/parse/parsed-node-types";
import { z } from "zod";

export const testTrpcInstance = initTRPC.create({});

export const parseTestRouterInputSchema = z.object({
  id: z.string(),
  age: z.number(),
  expectedAgeOfDeath: z.number().optional(),
  object: z.object({
    nestedId: z.string(),
  }),
  du: z.discriminatedUnion("d", [
    z.object({
      d: z.literal("one"),
      oneProps: z.string(),
    }),
    z.object({
      d: z.literal("two"),
    }),
  ]),
});

export const expectedTestRouterInputParsedNode: ObjectNode = {
  type: "object",
  path: [],
  children: {
    id: {
      type: "string",
      path: ["id"],
    },
    age: {
      type: "number",
      path: ["age"],
    },
    expectedAgeOfDeath: {
      type: "number",
      optional: true,
      path: ["expectedAgeOfDeath"],
    },
    object: {
      type: "object",
      path: ["object"],
      children: {
        nestedId: {
          type: "string",
          path: ["object", "nestedId"],
        },
      },
    },
    du: {
      type: "discriminated-union",
      path: ["du"],
      discriminatorName: "d",
      discriminatedUnionValues: ["one", "two"],
      discriminatedUnionChildrenMap: {
        one: {
          type: "object",
          path: ["du"],
          children: {
            d: {
              type: "literal",
              value: "one",
              path: ["du", "d"],
            },
            oneProps: {
              type: "string",
              path: ["du", "oneProps"],
            },
          },
        },
        two: {
          type: "object",
          path: ["du"],
          children: {
            d: {
              type: "literal",
              value: "two",
              path: ["du", "d"],
            },
          },
        },
      },
    },
  },
};

export const parseTestRouter = testTrpcInstance.router({
  testQuery: testTrpcInstance.procedure
    .input(parseTestRouterInputSchema)
    .query(() => "Nada"),
  testMutation: testTrpcInstance.procedure
    .input(parseTestRouterInputSchema)
    .mutation(() => "Nope"),
});
