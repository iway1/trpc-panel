import { ParsedProcedure, parseProcedure } from "@src/parse/parse-router";
import { Procedure } from "@src/parse/router-type";
import {
  expectedTestRouterInputParsedNode,
  parseTestRouter,
  parseTestRouterInputSchema,
} from "@src/parse/__tests__/utils/router";
import zodToJsonSchema from "zod-to-json-schema";

describe("Parse TRPC Procedure", () => {
  it("should parse the test query", () => {
    // IDK how to type this
    const testQuery = parseTestRouter.testQuery as unknown as Procedure;
    const expected: ParsedProcedure = {
      nodeType: "procedure",
      node: expectedTestRouterInputParsedNode,
      inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
      procedureType: "query",
      pathFromRootRouter: ["testQuery"],
    };
    const parsedProcedure = parseProcedure(testQuery, ["testQuery"], {});
    expect(expected).toStrictEqual(parsedProcedure);
  });
  it("should parse the test mutation", () => {
    // IDK how to type this
    const testQuery = parseTestRouter.testMutation as unknown as Procedure;
    const expected: ParsedProcedure = {
      nodeType: "procedure",
      node: expectedTestRouterInputParsedNode,
      inputSchema: zodToJsonSchema(parseTestRouterInputSchema),
      procedureType: "mutation",
      pathFromRootRouter: ["testMutation"],
    };
    const parsedProcedure = parseProcedure(testQuery, ["testMutation"], {});
    expect(expected).toStrictEqual(parsedProcedure);
  });
});
