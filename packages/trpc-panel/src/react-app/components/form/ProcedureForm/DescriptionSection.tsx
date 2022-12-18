import type { ProcedureExtraData } from "@src/parse/parseProcedure";
import { FormSection } from "@src/react-app/components/form/ProcedureForm/FormSection";
import React, { ReactNode } from "react";

export function DocumentationSection({
  extraData,
}: {
  extraData: ProcedureExtraData;
}) {
  const hasParams = Object.keys(extraData.parameterDescriptions).length > 0;
  if (!extraData.description && !hasParams) return null;

  return (
    <FormSection title="Docs">
      <div className="flex flex-col space-y-4">
        {extraData.description && (
          <DocumentationSubsection title="Description">
            {extraData.description}
          </DocumentationSubsection>
        )}
        {hasParams && (
          <DocumentationSubsection title="Params">
            <div className="pl-4 flex flex-row">
              <div className="flex flex-col">
                <ul className="space-y-2 list-disc">
                  {Object.entries(extraData.parameterDescriptions).map(
                    ([key]) => (
                      <li
                        key={key}
                        className="list-item border-b border-separatorLine flex-row space-x-2"
                      >
                        <span className="text-sm text-gray-500 font-bold">
                          {`${key}: `}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="flex flex-col">
                <ul className="space-y-2">
                  {Object.entries(extraData.parameterDescriptions).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="list-item border-b border-separatorLine flex-row space-x-2"
                      >
                        <span className="pl-4 text-sm text-gray-500 ">
                          {`${value}`}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </DocumentationSubsection>
        )}
      </div>
    </FormSection>
  );
}

function DocumentationSubsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-md text-gray-500 font-bold">{title}</span>
      <span className="text-sm text-gray-500">{children}</span>
    </div>
  );
}
