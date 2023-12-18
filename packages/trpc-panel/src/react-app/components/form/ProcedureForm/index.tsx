import React, { useEffect, useRef, useState } from "react";
import { Control, useForm, useFormState } from "react-hook-form";
import type { ParsedProcedure } from "@src/parse/parseProcedure";
import { ajvResolver } from "@hookform/resolvers/ajv";
import { defaultFormValuesForNode } from "@src/react-app/components/form/utils";
import { trpc } from "@src/react-app/trpc";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";
import { ProcedureFormButton } from "./ProcedureFormButton";
import { Response } from "./Response";
import { FormSection } from "./FormSection";
import { Error } from "./Error";
import { RequestResult } from "./RequestResult";
import { CollapsableSection } from "@src/react-app/components/CollapsableSection";
import { CloseIcon } from "@src/react-app/components/icons/CloseIcon";
import { ObjectField } from "@src/react-app/components/form/fields/ObjectField";
import { fullFormats } from "ajv-formats/dist/formats";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { DocumentationSection } from "@src/react-app/components/form/ProcedureForm/DescriptionSection";
import { Field } from "@src/react-app/components/form/Field";
import { ProcedureFormContextProvider } from "@src/react-app/components/form/ProcedureForm/ProcedureFormContext";
import getSize from "string-byte-length";

const TRPCErrorSchema = z.object({
  shape: z.object({
    message: z.string().optional(),
  }),
  data: z.object({
    code: z.string(),
    httpStatus: z.number(),
    stack: z.string().optional(),
  }),
});

export type TRPCErrorType = z.infer<typeof TRPCErrorSchema>;

function isTrpcError(error: unknown): error is TRPCErrorType {
  const parse = TRPCErrorSchema.safeParse(error);
  return parse.success;
}

export const ROOT_VALS_PROPERTY_NAME = "vals";

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
  const [queryEnabled, setQueryEnabled] = useState<boolean>(false);
  const [queryInput, setQueryInput] = useState<any>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const context = trpc.useContext();
  const [dataSize, setDataSize] = useState<number | undefined>();
  const [startTime, setStartTime] = useState<number | undefined>();
  const [opDuration, setOpDuration] = useState<number | undefined>();

  function getProcedure() {
    var cur: typeof trpc | (typeof trpc)[string] = trpc;
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
      enabled: queryEnabled,
      initialData: null,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (data: unknown) => {
        if (startTime) setOpDuration(Date.now() - startTime);
        setDataSize(getSize(JSON.stringify(data)));
        setStartTime(undefined);
      },
    });
  })() as UseQueryResult<any>;

  function invalidateQuery(input: any) {
    var cur: any = context;
    for (var p of procedure.pathFromRootRouter) {
      cur = cur[p];
    }
    cur.invalidate(input);
  }

  const mutation = (() => {
    const router = getProcedure();
    //@ts-ignore
    return router.useMutation({
      retry: false,
      onSuccess: (data: unknown) => {
        if (startTime) setOpDuration(Date.now() - startTime);
        setDataSize(getSize(JSON.stringify(data)));
        setStartTime(undefined);
      },
    });
  })() as UseMutationResult<any>;

  const {
    control,
    reset: resetForm,
    handleSubmit,
  } = useForm({
    resolver: ajvResolver(wrapJsonSchema(procedure.inputSchema as any), {
      formats: fullFormats,
    }),
    defaultValues: {
      [ROOT_VALS_PROPERTY_NAME]: defaultFormValuesForNode(procedure.node),
    },
  });
  function onSubmit(data: { [ROOT_VALS_PROPERTY_NAME]: any }) {
    setStartTime(Date.now());
    if (procedure.procedureType === "query") {
      const newData = { ...data };
      setQueryInput(newData[ROOT_VALS_PROPERTY_NAME]);
      setQueryEnabled(true);
      invalidateQuery(data.vals);
    } else {
      mutation
        .mutateAsync(data[ROOT_VALS_PROPERTY_NAME])
        .then(setMutationResponse)
        .catch();
    }
  }

  // I've seen stuff online saying form reset should happen in useEffect hook only
  // not really sure though, gonna just leave it for now
  const [shouldReset, setShouldReset] = useState(false);
  useEffect(() => {
    if (shouldReset) {
      resetForm(
        { [ROOT_VALS_PROPERTY_NAME]: defaultFormValuesForNode(procedure.node) },
        {
          keepValues: false,
          keepDirtyValues: false,
          keepDefaultValues: false,
        }
      );
      setShouldReset(false);
    }
  }, [shouldReset]);
  function reset() {
    setShouldReset(true);
    setQueryEnabled(false);
  }

  const data =
    procedure.procedureType === "query" ? query.data : mutationResponse;
  const error =
    procedure.procedureType == "query" ? query.error : mutation.error;

  const fieldName = procedure.node.path.join(".");

  return (
    <ProcedureFormContextProvider path={procedure.pathFromRootRouter.join(".")}>
      <CollapsableSection
        titleElement={
          <span className="font-bold text-lg flex flex-row items-center">
            {name}
          </span>
        }
        fullPath={procedure.pathFromRootRouter}
        sectionType={procedure.procedureType}
        focusOnScrollRef={formRef}
      >
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div className="flex flex-col">
            <DocumentationSection extraData={procedure.extraData} />

            <FormSection
              title="Input"
              topRightElement={<XButton control={control} reset={reset} />}
            >
              {procedure.node.type === "object" ? (
                Object.keys(procedure.node.children).length > 0 && (
                  <ObjectField
                    node={
                      procedure.node as ParsedInputNode & {
                        type: "object";
                      }
                    }
                    label={fieldName}
                    control={control}
                    topLevel
                  />
                )
              ) : (
                <Field inputNode={procedure.node} control={control} />
              )}

              <ProcedureFormButton
                text={`Execute ${name}`}
                colorScheme={"neutral"}
                loading={query.fetchStatus === "fetching" || mutation.isLoading}
              />
            </FormSection>
          </div>
        </form>
        <div className="flex flex-col space-y-4">
          {data && (
            <RequestResult result={data} size={dataSize} time={opDuration} />
          )}
          {!data && data !== null && (
            <Response>Successful request but no data was returned</Response>
          )}
          {error &&
            (isTrpcError(error) ? (
              <Error error={error} />
            ) : (
              <Response>{error}</Response>
            ))}
        </div>
      </CollapsableSection>
    </ProcedureFormContextProvider>
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

function wrapJsonSchema(jsonSchema: any) {
  delete jsonSchema["$schema"];

  return {
    type: "object",
    properties: {
      [ROOT_VALS_PROPERTY_NAME]: jsonSchema,
    },
    required: [],
    additionalProperties: false,
    $schema: "http://json-schema.org/draft-07/schema#",
  };
}
