import { Router, isRouter, isProcedure } from "./routerType";

import { Router as TRPCRouter } from "@trpc/server";
import { zodToJsonSchema } from "zod-to-json-schema";
import { logParseError } from "./parseErrorLogs";
import { ParsedProcedure, parseProcedure } from "./parseProcedure";

export type JSON7SchemaType = ReturnType<typeof zodToJsonSchema>;

export type ProcedureType = "query" | "mutation" | "subscription";

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
