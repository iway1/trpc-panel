import {
  Router,
  Procedure,
  isRouter,
  isProcedure,
  isQueryDef,
  isMutationDef,
} from "./router-type";
import { AnyZodObject, z } from "zod";
import { zodSelectorFunction } from "./input-mappers/zod/selector";
import { Router as TRPCRouter } from "@trpc/server";
import { zodToJsonSchema } from "zod-to-json-schema";
import { logParseError } from "./parse-error-log";
import { ParsedInputNode, ParseReferences } from "./parsed-node-types";

export type JSON7SchemaType = ReturnType<typeof zodToJsonSchema>;

export type ProcedureType = "query" | "mutation";

export type ParsedProcedure = {
  inputSchema: JSON7SchemaType;
  node: ParsedInputNode;
  nodeType: "procedure";
  procedureType: ProcedureType;
  pathFromRootRouter: string[];
};

export type ParsedRouterChildren = {
  [key: string]: ParsedRouter | ParsedProcedure;
};

export type ParsedRouter = {
  children: ParsedRouterChildren;
  path: string[];
  nodeType: "router";
};

export type ParseRouterRefs = {
  path: string[];
};

type SupportedInputType = "zod";

const inputParserMap = {
  zod: (zodObject: AnyZodObject, refs: ParseReferences) => {
    return zodSelectorFunction(zodObject._def, refs);
  },
};

function inputType(_: unknown): SupportedInputType | "unsupported" {
  return "zod";
}

// Some things in the router are not procedures, these are those things keys
const skipSet = new Set(["createCaller", "_def", "getErrorShape"]);

function parseRouter(
  router: Router,
  routerPath: string[],
  options: TrpcPanelExtraOptions
): ParsedRouter {
  const children: ParsedRouterChildren = {};
  var hasChild = false;
  // .procedures contains procedures and routers
  for (var [procedureOrRouterPath, child] of Object.entries(router)) {
    if (skipSet.has(procedureOrRouterPath)) continue;
    const newPath = routerPath.concat([procedureOrRouterPath]);
    const parsedNode = (() => {
      if (isRouter(child)) {
        return parseRouter(child, newPath, options);
      }
      if (isProcedure(child)) {
        return parseProcedure(child, newPath, options);
      }
      return null;
    })();
    if (!parsedNode) {
      logParseError(newPath.join("."), "Couldn't parse node.");
      continue;
    }
    hasChild = true;
    children[procedureOrRouterPath] = parsedNode;
  }
  if (!hasChild)
    logParseError(
      routerPath.join("."),
      `Router doesn't have any successfully parsed children.`
    );
  return { children, nodeType: "router", path: routerPath };
}
type NodeAndInputSchemaFromInputs =
  | {
      node: ParsedInputNode;
      schema: ReturnType<typeof zodToJsonSchema>;
      parseInputResult: "success";
    }
  | {
      parseInputResult: "failure";
    };

const emptyZodObject = z.object({});
function nodeAndInputSchemaFromInputs(
  inputs: unknown[],
  _routerPath: string[],
  options: TrpcPanelExtraOptions
): NodeAndInputSchemaFromInputs {
  if (!inputs.length) {
    return {
      parseInputResult: "success",
      schema: zodToJsonSchema(emptyZodObject, { errorMessages: true }),
      node: inputParserMap["zod"](emptyZodObject, {
        path: [],

        options,
      }),
    };
  }
  if (inputs.length !== 1) {
    return { parseInputResult: "failure" };
  }
  const input = inputs[0];
  const iType = inputType(input);
  if (iType == "unsupported") {
    return { parseInputResult: "failure" };
  }

  return {
    parseInputResult: "success",
    schema: zodToJsonSchema(input as any, { errorMessages: true }), //
    node: zodSelectorFunction((input as any)._def, {
      path: [],
      options,
    }),
  };
}

export function parseProcedure(
  procedure: Procedure,
  path: string[],
  options: TrpcPanelExtraOptions
): ParsedProcedure | null {
  const { _def } = procedure;
  const { inputs } = _def;

  const nodeAndInput = nodeAndInputSchemaFromInputs(inputs, path, options);
  if (nodeAndInput.parseInputResult === "failure") {
    return null;
  }

  const t = (() => {
    if (isQueryDef(_def)) return "query";
    if (isMutationDef(_def)) return "mutation";
    return null;
  })();

  if (!t) {
    return null;
  }

  return {
    inputSchema: nodeAndInput.schema,
    node: nodeAndInput.node,
    nodeType: "procedure",
    procedureType: t,
    pathFromRootRouter: path,
  };
}

export type TrpcPanelExtraOptions = {
  logFailedProcedureParse?: boolean;
  transformer?: "superjson";
};

export function parseRouterWithOptions(
  router: TRPCRouter<any>,
  parseRouterOptions: TrpcPanelExtraOptions
) {
  if (!isRouter(router)) {
    throw new Error("Non trpc router passed to trpc panel.");
  }
  return parseRouter(router, [], parseRouterOptions);
}
