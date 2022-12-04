import React, { useEffect, useState } from "react";
import { Control, useForm, useFormState } from "react-hook-form";
import {
    ParsedInputNode,
    ParsedProcedure,
} from "../../../../parse/parse-router";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { defaultFormValuesForNode } from "src/react-app/components/form/utils";
import { trpc } from "src/react-app/trpc";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";
import { ProcedureFormButton } from "./ProcedureFormButton";
import { Response } from "./Response";
import { FormSection } from "./FormSection";
import { Error } from "./Error";
import { RequestResult } from "./RequestResult";
import { CollapsableSection } from "src/react-app/components/CollapsableSection";
import { CloseIcon } from "src/react-app/components/icons/CloseIcon";
import { ObjectField } from "src/react-app/components/form/fields/ObjectField";

const TRPCErrorSchema = z.object({
    shape: z.object({
        message: z.string().optional(),
    }),
    data: z.object({
        code: z.string(),
        httpStatus: z.number(),
        stack: z.string(),
    }),
});

export type TRPCErrorType = z.infer<typeof TRPCErrorSchema>;

function isTrpcError(error: unknown): error is TRPCErrorType {
    const parse = TRPCErrorSchema.safeParse(error);
    return parse.success;
}

export function ProcedureForm({
    procedure,
    name,
}: {
    procedure: ParsedProcedure;
    name: string;
}) {
    // null => request was never sent
    // undefined => request successful but nothing returned from procedure
    const [mutationResponse, setMutationResponse] = useState<any>(null);
    const [queryInput, setQueryInput] = useState<any>(null);

    function getProcedure() {
        var cur: typeof trpc | typeof trpc[string] = trpc;
        for (var p of procedure.pathFromRootRouter) {
            // TODO - Maybe figure out these typings?
            //@ts-ignore
            cur = cur[p];
        }
        return cur;
    }

    const query = (() => {
        const router = getProcedure();
        //@ts-ignore
        return router.useQuery(queryInput, {
            enabled: !!queryInput,
            initialData: null,
            retry: false,
        });
    })() as UseQueryResult<any>;
    const mutation = (() => {
        const router = getProcedure();
        //@ts-ignore
        return router.useMutation({
            retry: false,
        });
    })() as UseMutationResult<any>;

    const {
        control,
        reset: resetForm,
        handleSubmit,
    } = useForm({
        resolver: ajvResolver(procedure.inputSchema as any),
        defaultValues: defaultFormValuesForNode(procedure.node),
    });

    function onSubmit(data: any) {
        if (procedure.procedureType === "query") {
            setQueryInput(data);
        } else {
            mutation.mutateAsync(data).then(setMutationResponse).catch();
        }
    }

    // I've seen stuff online saying form reset should happen in useEffect hook only
    // not really sure though, gonna just leave it for now
    const [shouldReset, setShouldReset] = useState(false);
    useEffect(() => {
        if (shouldReset) {
            resetForm(defaultFormValuesForNode(procedure.node), {
                keepValues: false,
                keepDirtyValues: false,
                keepDefaultValues: false,
            });
            setShouldReset(false);
        }
    }, [shouldReset]);
    function reset() {
        setShouldReset(true);
    }

    const data =
        procedure.procedureType === "query" ? query.data : mutationResponse;
    const error =
        procedure.procedureType == "query" ? query.error : mutation.error;
    return (
        <CollapsableSection
            titleElement={
                <span className="font-bold text-lg flex flex-row items-center">
                    {name}
                </span>
            }
            fullPath={procedure.pathFromRootRouter}
            sectionType={procedure.procedureType}
        >
            <form
                className="flex flex-col space-y-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                {procedure.node.type == "object" && (
                    <FormSection
                        title="Input"
                        topRightElement={
                            <XButton control={control} reset={reset} />
                        }
                    >
                        {Object.keys(procedure.node.children).length > 0 && (
                            <ObjectField
                                node={
                                    procedure.node as ParsedInputNode & {
                                        type: "object";
                                    }
                                }
                                control={control}
                                name={procedure.node.path.join(".")}
                                topLevel
                            />
                        )}

                        <ProcedureFormButton
                            text={`Execute ${name}`}
                            colorScheme={"neutral"}
                            loading={
                                (query.isLoading &&
                                    query.fetchStatus !== "idle") ||
                                mutation.isLoading
                            }
                        />
                    </FormSection>
                )}
            </form>
            <div className="flex flex-col space-y-4">
                {data && <RequestResult result={data} />}
                {!data && data !== null && (
                    <Response>
                        Successful request but no data was returned
                    </Response>
                )}
                {error &&
                    (isTrpcError(error) ? (
                        <Error error={error} />
                    ) : (
                        <Response>{JSON.stringify(error)}</Response>
                    ))}
            </div>
        </CollapsableSection>
    );
}

function XButton({
    control,
    reset,
}: {
    control: Control<any>;
    reset: () => void;
}) {
    const { isDirty } = useFormState({ control: control });

    function onClickClear() {
        reset();
    }

    return (
        <div className="w-6 h-6">
            {isDirty && (
                <button type="button" onClick={onClickClear}>
                    <CloseIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
