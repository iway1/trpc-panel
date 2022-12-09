export type ProcedureSharedProperties = {
    inputs: unknown[];
    meta: unknown;
};

export type RouterDef = {
    router: true;
    procedures: any;
} & { [path: string]: RouterOrProcedure };

export type QueryDef = {
    query: true;
} & ProcedureSharedProperties;

export type MutationDef = {
    mutation: true;
} & ProcedureSharedProperties;

export type RouterOrProducedureDef = RouterDef | QueryDef | MutationDef;

export type ProcedureDef = QueryDef | MutationDef;

export type Router = {
    _def: RouterDef;
} & { [pathName: string]: RouterOrProcedure };

export type Procedure = {
    _def: ProcedureDef;
};

export type RouterOrProcedure = Router | Procedure;
