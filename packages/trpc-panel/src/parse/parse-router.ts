import {
    RouterOrProcedure,
    Router,
    ProcedureDef,
    QueryDef,
    RouterOrProducedureDef,
    Procedure,
} from "./router-type";
import { z } from "zod";
import {
    mapZodObjectToNode,
    zodSelectorFunction,
} from "./input-mappers/zod/selector";
import { Router as TRPCRouter } from "@trpc/server";
import { zodToJsonSchema } from "zod-to-json-schema";
import { logParseError } from "./parse-error-log";
import { ParsedInputNode, ParserSelectorFunction } from "./parsed-node-types";

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
    zod: zodSelectorFunction,
};

function inputType(inputObject: unknown): SupportedInputType | "unsupported" {
    if (isZodObject(inputObject)) {
        return "zod";
    }
    return "unsupported";
}

function isObjectOrFunctionWithDef(
    o: unknown
): o is { _def: RouterOrProducedureDef } {
    if ((typeof o !== "object" && typeof o !== "function") || !o) return false;
    return "_def" in o && !!(o as { _def: unknown })._def;
}

function isRouter(routerOrProcedure: unknown): routerOrProcedure is Router {
    if (!isObjectOrFunctionWithDef(routerOrProcedure)) return false;
    return "router" in routerOrProcedure._def;
}

function isProcedure(
    routerOrProcedure: unknown
): routerOrProcedure is Procedure {
    if (!isObjectOrFunctionWithDef(routerOrProcedure)) return false;
    return (
        ("query" in routerOrProcedure._def ||
            "mutation" in routerOrProcedure._def) &&
        !!routerOrProcedure._def.inputs &&
        Array.isArray(routerOrProcedure._def.inputs)
    );
}

function isZodObject(maybeZodObject: any): maybeZodObject is z.ZodObject<any> {
    return (
        typeof maybeZodObject === "object" &&
        maybeZodObject &&
        !!maybeZodObject._def &&
        maybeZodObject._def?.typeName === "ZodObject"
    );
}

const ignoreRouterKeys = new Set(["_def", "createCaller", "getErrorShape"]);

function isQueryDef(_def: ProcedureDef): _def is QueryDef {
    return "query" in _def;
}

function parseRouter(router: Router, routerPath: string[], options: TrpcPanelExtraOptions): ParsedRouter {
    const children: ParsedRouterChildren = {};
    var hasChild = false;
    var hasFailedParse = false;
    for (var path in router) {
        if (ignoreRouterKeys.has(path)) continue;
        const child = router[path]!;

        const parsedNode = (() => {
            if (isRouter(child))
                return parseRouter(child, routerPath.concat([path]), options);
            if (isProcedure(child)) {
                return parseProcedure(child, routerPath, options);
            }
            return null;
        })();
        if (!parsedNode) {
            hasFailedParse = true;
            continue;
        }
        hasChild = true;
        children[path] = parsedNode;
    }
    if (!hasChild)
        logParseError(
            routerPath.join("."),
            `Router doesn't have any successfully parsed children.`
        );
    if (hasFailedParse)
        logParseError(
            routerPath.join("."),
            `Router had at least one failed parse.`
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
    path: string[],
    options: TrpcPanelExtraOptions
): NodeAndInputSchemaFromInputs {
    if (!inputs.length) {
        return {
            parseInputResult: "success",
            schema: zodToJsonSchema<undefined>(emptyZodObject),
            node: inputParserMap["zod"](emptyZodObject._def, {
                path: [],
                optional: false,
                options,
            }),
        };
    }
    const firstInputType = inputType(inputs[0]);
    const inputs = 

    return { parseInputResult: "failure" };
}

function parseProcedure(
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

    return {
        inputSchema: nodeAndInput.schema,
        node: nodeAndInput.node,
        nodeType: "procedure",
        procedureType: isQueryDef(_def) ? "query" : "mutation",
        pathFromRootRouter: path,
    };
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
            const child = routerOrProcedure[path]!;

            const parsedNode = parseNode(
                routerOrProcedure[path],
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
    } else if (isProcedure(routerOrProcedure)) {
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
    logParseError(
        currentNodePath.join("."),
        `bad value passed to parseNode: ${routerOrProcedure}`
    );
    return null;
}

export type TrpcPanelExtraOptions = {
    logFailedProcedureParse?: boolean;
    transformer?: "superjson";
};

export function parseRouterWithOptions(
    router: TRPCRouter<any>,
    parseRouterOptions: TrpcPanelExtraOptions
) {
    return parseNode(router, [], parseRouterOptions);
}
