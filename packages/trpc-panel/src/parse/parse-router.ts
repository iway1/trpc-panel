import {
    RouterOrProcedure,
    Router,
    ProcedureDef,
    QueryDef,
} from "./router-type";
import { z } from "zod";
import { mapZodObjectToNode } from "./input-mappers/zod";
import { Router as TRPCRouter } from "@trpc/server";
import { zodToJsonSchema } from "zod-to-json-schema";
import { logParseError } from "src/parse/parse-error-log";

export type JSON7SchemaType = ReturnType<typeof zodToJsonSchema>;

export type CommonInputType = "string" | "number" | "boolean";

type SharedInputNodeProperties = {
    path: (string | number)[];
    optional: boolean;
};

export type ParsedInputNode =
    | (
          | {
                type: CommonInputType;
            }
          | {
                type: "array";
                childType: ParsedInputNode;
            }
          | {
                type: "object";
                children: { [name: string]: ParsedInputNode };
            }
          | {
                type: "enum";
                enumValues: string[];
            }
          | {
                type: "discriminated-union";
                discriminatedUnionValues: string[];
                discriminatedUnionChildrenMap: {
                    [value: string]: ParsedInputNode;
                };
                discriminatorName: string;
            }
          | { type: "literal"; value: string | boolean | number | bigint }
      ) &
          SharedInputNodeProperties;

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

function isRouter(
    routerOrProcedure: RouterOrProcedure
): routerOrProcedure is Router {
    return "router" in routerOrProcedure._def;
}

function isZodObject(maybeZodObject: any): maybeZodObject is z.ZodObject<any> {
    return (
        typeof maybeZodObject === "object" &&
        maybeZodObject &&
        "_def" in maybeZodObject &&
        maybeZodObject["_def"]?.typeName === "ZodObject"
    );
}

const ignoreRouterKeys = new Set(["_def", "createCaller", "getErrorShape"]);

function isQueryDef(_def: ProcedureDef): _def is QueryDef {
    return "query" in _def;
}

export function parseNode(
    routerOrProcedure: RouterOrProcedure,
    currentNodePath: string[],
    parseRouterOptions: TrpcPanelExtraOptions
): ParsedRouter | ParsedProcedure | null {
    if (isRouter(routerOrProcedure)) {
        const children: ParsedRouterChildren = {};
        for (var path in routerOrProcedure) {
            // Only process routes
            if (ignoreRouterKeys.has(path)) continue;
            const parsedNode = parseNode(
                routerOrProcedure[path]!,
                currentNodePath.concat([path]),
                parseRouterOptions
            );
            if (!parsedNode) {
                // Would've already logged the error so just skip

                continue;
            }
            children[path] = parsedNode;
        }
        return { children, nodeType: "router", path: currentNodePath };
    } else {
        const { _def } = routerOrProcedure;
        const { inputs } = _def;
        const zodObjectInputs = inputs.filter((e) =>
            isZodObject(e)
        ) as z.ZodObject<any>[];
        if (inputs.length && zodObjectInputs.length != inputs.length) {
            logParseError(
                currentNodePath.join("."),
                "found non ZodObject input."
            );
            return null;
        }
        const mergedZodObject = zodObjectInputs.reduce(
            (a, b) => a.merge(b),
            z.object({})
        );
        const node = mapZodObjectToNode(mergedZodObject);

        if (!node) {
            logParseError(
                currentNodePath.join("."),
                "contained unsupported zod type."
            );
            return null;
        }
        return {
            // This is used to validate the form
            inputSchema: zodToJsonSchema<undefined>(mergedZodObject),
            // This is used to build the UI
            node,
            nodeType: "procedure",
            procedureType: isQueryDef(_def) ? "query" : "mutation",
            pathFromRootRouter: currentNodePath,
        };
    }
}

export type TrpcPanelExtraOptions = {
    logFailedProcedureParse?: boolean;
    transformer?: "superjson";
};

export function parseRouter(
    router: TRPCRouter<any>,
    parseRouterOptions: TrpcPanelExtraOptions
) {
    return parseNode(router, [], parseRouterOptions) as ParsedRouter;
}
