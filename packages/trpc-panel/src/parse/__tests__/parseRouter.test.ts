import { ParsedRouter, parseRouterWithOptions } from "@src/parse/parseRouter";
import {
  expectedTestRouterInputParsedNode,
  parseTestRouter,
  parseTestRouterInputSchema,
  testTrpcInstance,
} from "@src/parse/__tests__/utils/router";
import { zodToJsonSchema } from "zod-to-json-schema";

describe("Parse TRPC Router", () => {
  it("should parse the test router", () => {
    const expected: ParsedRouter = {
      path: [],
      nodeType: "router",
      children: {
        testQuery: {
          nodeType: "procedure",
          node: expectedTestRouterInputParsedNode,
          inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
          procedureType: "query",
          pathFromRootRouter: ["testQuery"],
          extraData: {
            parameterDescriptions: {}
          },
        },
        testMutation: {
          nodeType: "procedure",
          node: expectedTestRouterInputParsedNode,
          inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
          procedureType: "mutation",
          pathFromRootRouter: ["testMutation"],
           extraData: {
            parameterDescriptions: {}
          },
        },
      },
    };
    const parsed = parseRouterWithOptions(parseTestRouter, {});
    expect(parsed).toStrictEqual(expected);
  });

  it("should parse a nested test router", () => {
    const expected: ParsedRouter = {
      path: [],
      nodeType: "router",
      children: {
        nestedRouter: {
          nodeType: "router",
          path: ["nestedRouter"],
          children: {
            testQuery: {
              nodeType: "procedure",
              node: expectedTestRouterInputParsedNode,
              inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
              procedureType: "query",
              pathFromRootRouter: ["nestedRouter", "testQuery"],
               extraData: {
            parameterDescriptions: {}
          },
            },
            testMutation: {
              nodeType: "procedure",
              node: expectedTestRouterInputParsedNode,
              inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
              procedureType: "mutation",
              pathFromRootRouter: ["nestedRouter", "testMutation"],
               extraData: {
            parameterDescriptions: {}
          },
            },
          },
        },
      },
    };
    const parseTestNestedRouter = testTrpcInstance.router({
      nestedRouter: parseTestRouter,
    });
    const parsed = parseRouterWithOptions(parseTestNestedRouter, {});

    expect(expected).toStrictEqual(parsed);
  });
});
